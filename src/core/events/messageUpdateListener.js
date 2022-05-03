const Event = require("../../structures/Event");

module.exports = class MessageUpdateEvent extends Event {
    on (message) {
        this.nay.emit("messageCreate", message);
    }
};