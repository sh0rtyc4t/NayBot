const Event = require("../../structures/Event");

module.exports = class GuildDeleteEvent extends Event {
    on (guild) {
        this.nay.hooklog.guild("delete", guild);
        if (!this.nay.isDev) {
            this.nay.editChannel(this.config.servercountChannel, { name: `🚀❱ Servidores - ${this.nay.guilds.size}` });
            this.nay.editChannel(this.config.membercountChannel, { name: `👥❱ Usuários - ${this.nay.usersCount}` });
        }
        return guild;
    }
};