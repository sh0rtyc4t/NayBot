module.exports = function (warn, interaction) {
    const embed = {
        timestamp: new Date(),
        title: warn.name || "Warn",
        color: ctx.resolveColor("#fce35a"),
        description: (warn.message || warn).encode("js"),
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
            text: `Warn in: ${nay.instance}`,
            icon_url: nay.user.avatarURL
        }
    };

    ctx.hooks.errorLog({ embeds: [embed] });
};