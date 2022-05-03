const Event = require("../../structures/Event");

module.exports = class ErrorEvent extends Event {
    on (err, interaction) {
        return this.nay.log.error(err, { webhook: true }, interaction);
    }

};