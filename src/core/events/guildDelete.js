module.exports = function (guild) {
    ctx.hooks.guildLog(0, {
        embed: {
            ...new ctx.BaseEmbed(null, "Servidor Deletado"),
            color: ctx.resolveColor("#F02525"),
            image: { url: guild.dynamicIconURL(null, 1024) },
            fields: [
                {
                    name: "Guild",
                    value: `- ${guild.name} ┃ ${guild.id}`.encode("diff")
                },
                {
                    name: "Criador",
                    value: `${guild.ownerID}`.encode("fix")
                },
                {
                    name: "Membros",
                    value: `${guild.memberCount}`.encode("js")
                }
            ]
        }
    });

    if (nay.instance === "nightly") return;
    nay.editChannel(ctx.config.servercountChannel, { name: `🚀❱ Servidores - ${nay.guilds.size}` });
    nay.editChannel(ctx.config.membercountChannel, { name: `👥❱ Usuários - ${nay.guilds.reduce((a, g) => a += g.memberCount, 0)}` });
};