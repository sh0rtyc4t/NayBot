const bytes = require("bytes");
const cpu = require("node-os-utils").cpu;
const pkg = require(`${ctx.mainDir}/package.json`);

module.exports = async function (interaction) {
    await interaction.defer();
    const T = global.t("commands:botinfo", { returnObjects: true });
    const message = await interaction.reply({ embed: {
        ...new ctx.BaseEmbed(T.embed.description, T.embed.title),
        thumbnail: { url: nay.user.dynamicAvatarURL("png", 512) }
    }}, [
        {
            type: "menu",
            name: "botinfomenu",
            options: [
                {
                    label: "Nay",
                    value: "bot",
                    description: T.menuoptions.first.description,
                    emoji: { name: "💜" }
                },
                {
                    ...T.menuoptions.second,
                    value: "statistics",
                    emoji: {
                        name: "nayStatistics",
                        id: "937415374180323429"
                    }
                },
                {
                    ...T.menuoptions.third,
                    value: "status",
                    emoji: {
                        name: "nayHost",
                        id: "937415374184521748"
                    }
                }
            ]
        }
    ]);

    const embeds = {
        bot: {
            title: T.nayembed.title,
            description: t("commands:botinfo.nayembed.description", {
                ownerTag: (await nay.getRESTUser(ctx.config.owners[0])).tag,
                createdAt: nay.formattedCreatedAt(t.lng.slice(0, -3))
            }),
            fields: [
                {
                    name: t("commands:botinfo.nayembed.fields.0.name"),
                    value: t("commands:botinfo.nayembed.fields.0.value", {
                        coOwner: (await nay.getRESTUser(ctx.config.owners[1])).tag,
                        github: pkg.repository.url,
                        serverInvite: `https://discord.gg/${(await nay.createChannelInvite("812309085508468769")).code}`
                    })
                }
            ],
            thumbnail: { url: nay.user.dynamicAvatarURL("png", 512) },
            color: ctx.resolveColor("#FF0000")
        },

        statistics: {
            ...new ctx.BaseEmbed(null, T.statisticsembed.title),
            thumbnail: { url: nay.user.dynamicAvatarURL("png", 512) },
            fields: [
                {
                    name: T.statisticsembed.fields[0],
                    value: String(nay.guilds.size).encode("js"),
                    inline: true
                },
                {
                    name: T.statisticsembed.fields[1],
                    value: String(nay.usersCount).encode("js"),
                    inline: true
                },
                {
                    name: T.statisticsembed.fields[2],
                    value: `# ${nay.instance}`.encode("md")
                },
                {
                    name: T.statisticsembed.fields[3],
                    value: String(nay.commands.filter(c => !c.acess?.forDevs).length).encode("fix"),
                    inline: true
                },
                {
                    name: T.statisticsembed.fields[4],
                    value: String(await db.getVal("nay/totalCommands") ?? 0).encode("fix"),
                    inline: true
                },
                {
                    name: T.statisticsembed.fields[5],
                    value: `# ${pkg.version}`.encode("md")
                },
                {
                    name: T.statisticsembed.fields[6],
                    value: `- ${await db.getVal(`guilds/${interaction.guildID}/commands`) ?? 0}`.encode("diff"),
                    inline: true
                },
                {
                    name: T.statisticsembed.fields[7],
                    value: `- ${await db.getVal(`users/${interaction.member.id}/commands`) ?? 0}`.encode("diff"),
                    inline: true
                }
            ]
        },

        status: {
            ...new ctx.BaseEmbed(null, T.statusembed.title),
            thumbnail: { url: nay.user.dynamicAvatarURL("png", 512) },
            fields: [
                {
                    name: T.statusembed.fields[0],
                    value: `${bytes(process.memoryUsage.rss())}/200MB`.encode("fix"),
                    inline: true
                },
                {
                    name: T.statusembed.fields[1],
                    value: `${await cpu.usage()}%`.encode("fix"),
                    inline: true
                },
                {
                    name: "Uptime",
                    value: `- ${nay.formattedUptime(t.lng.slice(0, -3))}`.encode("diff")
                },
                {
                    name: T.statusembed.fields[2],
                    value: `# ${process.version}`.encode("md"),
                    inline: true
                },
                {
                    name: T.statusembed.fields[3],
                    value: `# v${pkg.dependencies.eris.replace("^", "")}`.encode("md"),
                    inline: true
                }
            ]
        }
    };

    message.createComponentCollector({ disableOnEnd: true }, option => message.edit({ embed: embeds[option.data.values[0]] }));

};