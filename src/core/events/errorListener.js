const Event = require("../../structures/Event");

module.exports = class ErrorEvent extends Event {
    constructor (nay) {
        super(nay);
    }

    on (err, interaction) {
        this.nay.log.error(err, { webhook: true }, interaction);
        // const lastMessage = await ctx.hooks.errorLog({
        //     embed,
        //     wait: true
        // }, nay.notes.get("lastErrorhookMsg"));
        // return nay.notes.set("lastErrorhookMsg", lastMessage.id);
    }

};