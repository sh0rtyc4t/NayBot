const Event = require("../../structures/Event");

module.exports = class DebugEvent extends Event {
    constructor (nay) {
        super(nay);
    }

    on (message) {
        this.nay.log.debug(message);
    }
};