const i18 = require("i18next");
const NayUser = require(`${ctx.mainDir}/src/utils/classes/nayUser.js`);

module.exports = async function (interaction) {
    if (!(interaction instanceof ctx.Eris.CommandInteraction)) return;
    global.t = i18.getFixedT(interaction.member?.guild?.preferredLocale || "en-US");

    if (!await NayUser.check(interaction.member.id)) await new NayUser(interaction.member.id).register();
    await db.set(`guilds/${interaction.guildID}`, { commands: 0 }, true);
    db.add(`users/${interaction.member.id}/commands`);
    db.add("nay/totalCommands");
    db.add(`guilds/${interaction.guildID}/commands`);

    const command = interaction.data.name;
    const commandData = nay.commands.find(c => c.name === command);

    if (!commandData) return interaction.createError(t("errors:commandNotFound"));

    return commandData.execute(interaction);
};