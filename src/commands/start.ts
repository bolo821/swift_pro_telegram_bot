import Logging from '../utils/logging';
import { botEnum } from '../constants/botEnum';
import { startMessage } from '../utils/messages';
import { markupStart } from '../utils/inline.markups';
import { createAppUserIfNotExist, updateChatId, userVerboseLog } from '../service/app.user.service';
import { getTransactionBackupById, retryTx } from '../service/transaction.backup.service';
import { processError } from '../service/error';
import { AffiliateService } from '../service/affiliate.service';
import { getSelectedChain, selectChain } from '../service/connected.chain.service';
import { getAllChains } from '../service/chain.service';
import { processContractAddress } from '../service/token.service';

const invokeStart = async (ctx: any) => {
    const telegramId = ctx.from.id;
    // check if user exist, save if not found
    try {
        await userVerboseLog(telegramId, '/start' + ' ' + JSON.stringify(ctx.from));

        const accountExistsOrCreated = await createAppUserIfNotExist(telegramId, ctx.from.first_name, ctx.from.last_name, ctx.from.username, ctx.chat.id);
        if (accountExistsOrCreated) {
            await userVerboseLog(telegramId, 'already exists in database');
        }

        try {
            let chain = await getSelectedChain(telegramId)
        } catch (err) {
            const allChains = getAllChains()
            await selectChain(telegramId, allChains[0])
        }
        const chain = await getSelectedChain(telegramId)

        await updateChatId(telegramId, ctx.chat.id);

        try {
            if (ctx.update?.message?.text === undefined) {
                await ctx.deleteMessage();
            }
        } catch { }

        // process start with address on payload
        if ((ctx.startPayload !== undefined && ctx.startPayload !== null) && ctx.startPayload.length > 0 && /^0x[a-fA-F0-9]{40}$/.test(ctx.startPayload)) {
            const address = ctx.startPayload
            await processContractAddress(ctx, telegramId, chain, address, undefined, (new Date()).getTime())
        } else {
            await ctx.telegram.sendMessage(ctx.chat.id, startMessage, {
                parse_mode: botEnum.PARSE_MODE_V2,
                reply_markup: markupStart(telegramId, ctx.from.first_name),
                disable_web_page_preview: true
            });
        }
    } catch (err) {
        await processError(ctx, telegramId, err)
    }


    // process start subscription
    if ((ctx.startPayload !== undefined && ctx.startPayload !== null) && ctx.startPayload.length > 0 && /swift_code/.test(ctx.startPayload)) {
        const code = ctx.startPayload.split("_").splice(-1)[0]
        await new AffiliateService().processSubscription(ctx, telegramId, `https://swiftbot.io/${code}`)
    }
};

module.exports = (bot: any) => {
    bot.start(invokeStart);
    bot.action(botEnum.menu.value, invokeStart);

    bot.action(RegExp('^' + botEnum.closeTxMessage + '_.+'), async (ctx: any) => {
        try {
            const tbckId = ctx.update.callback_query.data.slice(botEnum.closeTxMessage.length + 1);
            const tbck: any = await getTransactionBackupById(tbckId);
            if (tbck === null) {
                await ctx.telegram.sendMessage(ctx.chat.id, '❌ No valid action');
            } else {
                await tbck.populate('user');
                await ctx.telegram.deleteMessage(tbck.user.chatId, tbck.msgId);
            }
        } catch (err) {
            await processError(ctx, ctx.from.id, err)
        }
    });

    bot.action(RegExp('^' + botEnum.retryTxMessage + '_.+'), async (ctx: any) => {
        try {
            const tbckId = ctx.update.callback_query.data.slice(botEnum.retryTxMessage.length + 1);
            await retryTx(ctx, tbckId);
        } catch (err) {
            await processError(ctx, ctx.from.id, err)
        }
    });
};
