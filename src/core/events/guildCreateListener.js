const Event = require("../../structures/Event");

module.exports = class GuildCreateEvent extends Event {
    constructor (nay) {
        super(nay);
    }

    on (guild) {
        this.nay.log.guildLog("create", guild);
        if (!this.nay.isDev) {
            this.nay.editChannel(this.config.servercountChannel, { name: `🚀❱ Servidores - ${this.nay.guilds.size}` });
            this.nay.editChannel(this.config.membercountChannel, { name: `👥❱ Usuários - ${this.nay.usersCount}` });
        }
        return guild;
    }
};