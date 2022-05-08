const Event = require("../../structures/Event");

module.exports = class WarnEvent extends Event {
    on (warn) {
        this.nay.log.warn(warn);
        return this.nay.hooklog.alert(warn, "Warn");
    }
};