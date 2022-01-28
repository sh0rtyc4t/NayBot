module.exports = class HookLogs {
    constructor (webhooksData) {
        this.dmhook = webhooksData.dms;
        this.reporthook = webhooksData.reports;
        this.errorhook = webhooksData.errors;
        this.guildhook = webhooksData.guilds;
    }

    dmLog (msgObj) {
        if (typeof msgObj === "string") msgObj = { content: msgObj };
        return nay.executeWebhook(this.dmhook.id, this.dmhook.token, msgObj);
    }

    reportLog (msgObj) {
        if (typeof msgObj === "string") msgObj = { content: msgObj };
        return nay.executeWebhook(this.reporthook.id, this.reporthook.token, msgObj);
    }

    guildLog (type, msgObj) {
        if (typeof msgObj === "string") msgObj = { content: msgObj };
        return nay.executeWebhook(this.guildhook.id, this.guildhook.token, {
            ...msgObj,
            avatarURL: type
                ? "https://media.discordapp.net/attachments/897352579636400150/936601578020937778/discord-icon-green.png"
                : "https://media.discordapp.net/attachments/897352579636400150/936601577609904158/discord-icon-red.png",
            username: type
                ? "Guild Create"
                : "Guild Delete"
        });
    }

    async errorLog (msgObj, editMsg) {
        if (typeof msgObj === "string") msgObj = { content: msgObj };
        if (editMsg) {
            const lastMsg = await nay.getMessage(ctx.config.errorschannel, editMsg);
            if (lastMsg.embeds[0]?.description === msgObj.embed?.description) {
                const errorsSize = lastMsg.embeds[0]?.title.match(/x\d\d?/m)[0];
                const totalErrors = Number(errorsSize.slice(1)) + 1;
                msgObj.embed.title = msgObj.embed?.title.replace("x1", `x${totalErrors}`);
                return nay.editWebhookMessage(this.errorhook.id, this.errorhook.token, editMsg, msgObj);
            }
        }
        return nay.executeWebhook(this.errorhook.id, this.errorhook.token, msgObj);
    }
};