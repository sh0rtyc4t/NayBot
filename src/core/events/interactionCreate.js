module.exports = function (interaction) {
    if (!(interaction instanceof ctx.Eris.CommandInteraction)) return;

    const command = interaction.data.name;
    const commandData = nay.commands.find(c => c.name === command);

    if (!commandData) return interaction.createError("Este comando não está registrado em minha lista. Talvez ele seja um comando de teste ou ainda não esteja pronto");

    return commandData.execute(interaction);
};