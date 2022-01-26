const i18 = require("i18next");
const NayUser = require(`${ctx.mainDir}/src/utils/classes/nayUser.js`);

module.exports = async function (interaction) {
    if (!(interaction instanceof ctx.Eris.CommandInteraction)) return;
    await interaction.defer();
    global.t = i18.getFixedT(interaction.member?.guild?.preferredLocale || "en-US");

    if (!await NayUser.check(interaction.member.id)) new NayUser(interaction.member.id).register();

    const command = interaction.data.name;
    const commandData = nay.commands.find(c => c.name === command);

    if (!commandData) return interaction.createError(t("errors:commandNotFound"));

    return commandData.execute(interaction);
};