const i18 = require("i18next");
module.exports = function (interaction) {
    if (!(interaction instanceof ctx.Eris.CommandInteraction)) return;

    global.t = i18.getFixedT(interaction.member.guild.preferredLocale);
    const command = interaction.data.name;
    const commandData = nay.commands.find(c => c.name === command);

    if (!commandData) return interaction.createError(t("errors:commandNotFound"));

    return commandData.execute(interaction);
};