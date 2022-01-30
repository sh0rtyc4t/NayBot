const util = require("util");
module.exports = async function (interaction) {
    const text = interaction.data.options[0].value;
    await interaction.defer(64);
    try {
        const evalued = util.inspect(await eval(`(async()=>{${text}\n})()`), { depth: 2 }).slice(0, 3960);
        return interaction.reply({ embeds: [new ctx.BaseEmbed(evalued.encode("js"), "Eval")] });
    } catch (e) {
        return interaction.reply(`Houve um erro na execução do eval:\n\`${e}\``);
    }
};