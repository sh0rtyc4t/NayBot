const Event = require("../../structures/Event");

module.exports = class WarnEvent extends Event {
    on (warn, interaction) {
        return this.nay.log.warn(warn, { webhook: true }, interaction);
    }

};