const Event = require("../../structures/Event");

module.exports = class ErrorEvent extends Event {
    on (err) {
        this.nay.log.error(err);
        return this.nay.hooklog.alert(err, "Error");
    }
};