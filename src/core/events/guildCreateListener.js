const Event = require("../../structures/Event");
const i18 = require("i18next");

module.exports = class GuildCreateEvent extends Event {
    on (guild) {
        this.nay.hooklog.guildLog("create", guild);
        if (!this.nay.isDev) {
            this.nay.editChannel(this.config.servercountChannel, { name: `🚀❱ Servidores - ${this.nay.guilds.size}` });
            this.nay.editChannel(this.config.membercountChannel, { name: `👥❱ Usuários - ${this.nay.usersCount}` });
        }
        const welcomeChannel = guild.channels.find(c => {
            const perm = c.permissionsOf(this.nay.user.id);
            return c.type === 0 && perm.has("viewChannel") && perm.has("sendMessages") && perm.has("embedLinks");
        });
        const t = i18.getFixedT(guild.preferredLocale);
        this.db.guilds.doc(guild.id).create({
            locale: guild.preferredLocale,
            commands: 0
        });

        if (welcomeChannel) {
            const embed = this.nay.utils.makeEmbed(`
            :flag_br: :flag_pt: Esta menssagem está na lingua padrão do servidor, administrador use \`/language guild Português BR\`
            :flag_us: :flag_gb: This message is in the server's default language, admin use \`/language guild English\`

            ${t("events:guildCreate.welcomeMessage")}
            `, "Hello");

            welcomeChannel.createMessage({ embed });
        }

        return guild;
    }
};