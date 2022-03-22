const Event = require("../../structures/Event");
const i18 = require("i18next");

module.exports = class InteractionCreateEvent extends Event {
    constructor (nay) {
        super(nay);
    }

    async on (interaction) {
        if (!(interaction instanceof this.modules.Eris.CommandInteraction)) return;
        const authorDoc = this.db.users.doc(interaction.member.id);
        const guildDoc = this.db.guilds.doc(interaction.guildID);
        const configDoc = this.db.nay.doc("config");
        const commandData = this.nay.cmdHand.commands.get(interaction.data.name);

        await interaction.acknowledge();

        if (await authorDoc.exists()) authorDoc.update({ commands: (await authorDoc.get()).commands + 1 });
        else authorDoc.create({
            batatas: 0,
            commands: 1,
            locale: null
        });

        if (await guildDoc.exists()) guildDoc.update({ commands: (await guildDoc.get()).commands + 1 });
        else guildDoc.create({
            locale: interaction.member.guild.preferredLocale,
            commands: 1
        });

        configDoc.update({ totalCommands: (await configDoc.get()).totalCommands + 1 });
        const t = i18.getFixedT(await authorDoc.get("locale") || await guildDoc.get("locale") || "en-US");

        if (!commandData?.execute) return interaction.createError(t("errors:commandNotFound"));
        return commandData.execute(interaction, t, {
            authorDoc,
            guildDoc,
            configDoc
        });
    }
};