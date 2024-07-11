import Logging from '../../utils/logging';
import { botEnum } from '../../constants/botEnum';
import { linkAccountMessage } from '../../utils/messages';
import { userVerboseLog } from '../../service/app.user.service';
import { processError } from '../../service/error';

module.exports = (bot: any) => {
    bot.action(botEnum.markupStart, async (ctx: any) => {
        const telegramId = ctx.from.id;

        try {
            await userVerboseLog(telegramId, 'link account');

            try {
                await ctx.deleteMessage();
            } catch { }

            await bot.telegram.sendMessage(ctx.chat.id, linkAccountMessage(telegramId), {
                parse_mode: botEnum.PARSE_MODE_V2,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: botEnum.menu.key,
                                callback_data: botEnum.menu.value
                            }
                        ]
                    ]
                }
            });
        } catch (err) {
            await processError(ctx, telegramId, err)
        }
    });
};
