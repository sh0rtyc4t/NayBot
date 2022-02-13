const Event = require("../../structures/Event");

module.exports = class WarnEvent extends Event {
    constructor (nay) {
        super(nay);
    }

    on (warn, interaction) {
        this.nay.log.warn(warn, { webhook: true }, interaction);
        // const lastMessage = await ctx.hooks.errorLog({
        //     embed,
        //     wait: true
        // }, nay.notes.get("lastErrorhookMsg"));
        // return nay.notes.set("lastErrorhookMsg", lastMessage.id);
    }

};