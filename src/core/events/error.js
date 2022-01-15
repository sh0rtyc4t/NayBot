module.exports = function (err, interaction) {
    const embed = {
        timestamp: new Date(),
        title: err.name || "Error",
        color: ctx.resolveColor(ctx.config.baseColor),
        description: (err.message || err).encode("js"),
        fields: [
            {
                name: "Local",
                value: `**Guild:**\n\`${interaction?.member?.guild.name || "Nenhum"} | ${interaction?.guildID || "Sem ID"}\``
            },
            {
                name: "Usuário",
                value: `\`${interaction?.member?.user.tag || "Nenhum"} | ${interaction?.member?.id || "Sem ID"}\``
            }
        ],
        footer: {
            text: `Error in: ${nay.instance}`
        }
    };

    console.log(err);
    ctx.hooks.errorLog({ embeds: [embed] });
};