const Event = require("../../structures/Event");
const userModel = require("../database/models/user.js");
const guildModel = require("../database/models/guild.js");
const i18 = require("i18next");

module.exports = class InteractionCreateEvent extends Event {
    async on (interaction) {
        if (!(interaction instanceof this.modules.Eris.CommandInteraction)) return;

        const authorDoc = interaction.author.doc;
        const guildDoc = interaction.member?.guild.doc;
        const commandData = this.nay.cmdHand.commands.get(interaction.data.name);
        await interaction.defer();
        const [authorExist, guildExist] = await Promise.all([authorDoc.exists, guildDoc?.exists]);

        if (authorExist) authorDoc.add("commands");
        else authorDoc.create(userModel());

        if (guildDoc) guildExist
            ? guildDoc.add("commands")
            : guildDoc.create(guildModel({ locale: interaction.member.guild.preferredLocale }));

        this.db.admin.doc("data").add("totalCommands", 1);
        const t = i18.getFixedT(await authorDoc.get("locale") || await guildDoc.get("locale") || "en-US");

        if (!commandData?.execute) return interaction.createError(t("errors:commandNotFound"));
        return commandData.execute(interaction, t);
    }
};