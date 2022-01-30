module.exports = function (guild) {
    ctx.hooks.guildLog(1, {
        embed: {
            ...new ctx.BaseEmbed(null, "Novo Servidor!"),
            color: ctx.resolveColor("#0AE714"),
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
    nay.editChannel(ctx.config.membercountChannel, { name: `👥❱ Usuários - ${nay.usersCount}` });
};