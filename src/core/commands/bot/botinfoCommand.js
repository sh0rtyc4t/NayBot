const bytes = require("bytes");
const cpu = require("node-os-utils").cpu;
module.exports = async function (interaction) {
    interaction.defer();
    const discloudinfo = await (await fetch("https://discloud.app/status/bot/789123515882012683", {
        headers: { "api-token": ctx.config.discloudtoken }
    })).json();

    const embed = {
        ...new ctx.BaseEmbed(),
        thumbnail: { url: nay.user.avatarURL },
        fields: [
            {
                name: "Uso de RAM",
                value: (discloudinfo?.memory || `${bytes(process.memoryUsage.rss())}/200MB`).encode("fix")
            },
            {
                name: "Uso de CPU",
                value: (discloudinfo?.cpu || `${await cpu.usage()}%`).encode("fix")
            },
            {
                name: "Guilds",
                value: String(nay.guilds.size).encode("js"),
                inline: true
            },
            {
                name: "Users",
                // eslint-disable-next-line no-return-assign
                value: String(nay.guilds.reduce((a, g) => a += g.memberCount, 0)).encode("js"),
                inline: true
            },
            {
                name: "Uptime",
                value: `- ${discloudinfo?.last_restart}`.encode("diff")
            }
        ]
    };

    interaction.reply({ embeds: [embed] });
};