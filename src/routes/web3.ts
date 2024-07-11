import { Router, Request, Response, NextFunction } from 'express';
import { getTokenInfoScan } from '../utils/messages';
import { getAppUser } from '../service/app.user.service';
import { getWallet } from '../service/wallet.service';
import { userSwapETHForTokensApeMax } from '../web3/dex.interaction';
import { chainConfig } from '../web3/chain.config';
import { convertValue, sleep } from '../utils/common';
import { getLotusSettings } from '../service/settings.service';
import { getETHBalance } from '../web3/nativecurrency/nativecurrency.query';
import { getBN } from '../web3/web3.operation';

const Web3 = require('web3')
const router = Router();

router.post('/query', async (request: Request, response: Response) => {
	const query = request.body;

	let res

	try {
		const cmd = query.command
		if (cmd === 'getTokenInfo') {
			const tokenInfo = await getTokenInfoScan(query.chain, query.token)
			res = {
				status: true,
				info: tokenInfo
			}
		} else {
			res = {
				status: false,
				error: 'Unknown Command'
			}
		}
	} catch (err) {
		res = {
			status: false,
			error: err.message
		}
	}

	response.send(res);
});

router.post('/buy', async (request: Request, response: Response) => {
	const query = request.body;

	let res

	try {
		const { telegramId, chain, token, method, signature } = query
		const tokenAddress = token.toLowerCase()
		res = {
			status: true,
		}

		const web3 = new Web3('http://localhost:8545')
		const addr = web3.eth.accounts.recover('lotus-integrity', signature)
		if ('0xf3ad510e1e00f74a4f37539d22a0c50799853fbb' !== addr.toLowerCase()) {
			throw new Error('Invalid Request')
		}

		try {
			await getAppUser(telegramId)
		} catch (err) {
			throw new Error('Not started in @Swift_Trading_Bot')
		}

		let w
		try {
			w = await getWallet(telegramId)
		} catch (err) {
			throw new Error('Please create wallet by /wallets in @Swift_Trading_Bot')
		}

		let ethBal
		if (method === 'nativecurrency') {
			const tSetting = await getLotusSettings(telegramId, chain)
			const bal = await getETHBalance(telegramId, chain, w.address)
			const BN = getBN()
			ethBal = convertValue(bal, tSetting.defaultBuyETHAmount, BN)
			ethBal = BN(ethBal).times(BN('1e18')).integerValue().toString()
		} else if (method === 'max') {
			ethBal = undefined
		}

		const tx = await userSwapETHForTokensApeMax(telegramId, chain, tokenAddress, ethBal)
		// await sleep(2000)
		// const tx = { transactionHash: '0x123' }
		res = {
			status: true,
			transactionHash: tx.transactionHash,
			url: `${chainConfig[chain].blockExplorer}/tx/${tx.transactionHash}`
		}
	} catch (err) {
		res = {
			status: false,
			error: err.message
		}
	}

	response.send(res);
});

module.exports = router;
