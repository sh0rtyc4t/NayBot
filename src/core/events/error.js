module.exports = async function (err, interaction) {
    const embed = {
        timestamp: new Date(),
        title: `${err.name || "Error"} x1`,
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

    const lastMessage = await ctx.hooks.errorLog({
        embed,
        wait: true
    }, nay.notes.get("lastErrorhookMsg"));
    return nay.notes.set("lastErrorhookMsg", lastMessage.id);
};