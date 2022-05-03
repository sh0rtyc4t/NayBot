const Event = require("../../structures/Event");

module.exports = class DebugEvent extends Event {
    on (message) {
        return this.nay.log.debug(message);
    }
};