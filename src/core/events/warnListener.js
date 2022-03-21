const Event = require("../../structures/Event");

module.exports = class WarnEvent extends Event {
    constructor (nay) {
        super(nay);
    }

    on (warn, interaction) {
        return this.nay.log.warn(warn, { webhook: true }, interaction);
    }

};