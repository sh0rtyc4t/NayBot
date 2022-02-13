const Event = require("../../structures/Event");

module.exports = class GuildCreateEvent extends Event {
    constructor (nay) {
        super(nay);
    }

    on (message) {
        this.nay.emit("messageCreate", message);
    }
};