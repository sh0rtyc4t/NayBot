module.exports = class HookLogs {
    constructor (webhooksData) {
        this.dmhook = webhooksData.dms;
        this.reporthook = webhooksData.reports;
        this.errorhook = webhooksData.errors;
    }

    dmLog (msgObj) {
        if (typeof msgObj === "string") msgObj = { content: msgObj };
        return nay.executeWebhook(this.dmhook.id, this.dmhook.token, msgObj);
    }

    reportLog (msgObj) {
        if (typeof msgObj === "string") msgObj = { content: msgObj };
        return nay.executeWebhook(this.reporthook.id, this.reporthook.token, msgObj);
    }

    errorLog (msgObj) {
        if (typeof msgObj === "string") msgObj = { content: msgObj };
        return nay.executeWebhook(this.errorhook.id, this.errorhook.token, msgObj);
    }
};