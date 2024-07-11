export class BotMessage {
    public startMessage() {
        return `<b> Swift Verify Bot</b> 🔫
Welcome to the most advanced and intricate telegram trading bot on the market, made by @SwiftPortalOfficial

On this bot you can Authenticate and manage devices on Swift Ecosystem.`;
    }

    public linkAccountMessage(telegramId: string) {
        return `
🔗 <b>Link dapp account</b>
scan the QR on mobile or enter code on desktop:
enter code <b>S-<code>${telegramId}</code></b>
`;
    }

    public preAuthMessage(key: string, ip: string, device: string) {
        let signInKey = "";
        const signInKeyTemp = key.split(" ");

        for (let i = 0; i < signInKeyTemp.length; i++) {
            if (i == 0) {
                signInKey = `${i + 1}.${signInKeyTemp[i]}`;
            } else {
                signInKey += ` ${i + 1}.${signInKeyTemp[i]}`;
            }
        }

        return `<b>You’ve initiated a request to Login</b>

👀 ip: ${ip}
🌐 device: ${device}

🔐 Sign In Key: <b><code>${signInKey}</code></b>

<i>⚠️ If you did not request this login, just ignore it.</i>
    `;
    }
}
