const bytes = require("bytes");
const cpu = require("node-os-utils").cpu;
const pkg = require("../../../../package.json");
const Command = require("../../../structures/Command");

module.exports = class BotinfoCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    async execute (interaction, t) {
        const T = t("commands:botinfo", { returnObjects: true });
        const embeds = {
            bot: {
                title: T.nayembed.title,
                description: t("commands:botinfo.nayembed.description", {
                    ownerTag: (await this.nay.getRESTUser(this.config.owners[0])).tag,
                    createdAt: this.nay.formattedCreatedAt(t)
                }),
                fields: [
                    {
                        name: t("commands:botinfo.nayembed.fields.0.name"),
                        value: t("commands:botinfo.nayembed.fields.0.value", {
                            coOwner: (await this.nay.getRESTUser(this.config.owners[1])).tag,
                            github: this.config.urls.botRepoUrl,
                            serverInvite: this.config.urls.botServerInvite
                        })
                    }
                ],
                thumbnail: { url: this.nay.user.dynamicAvatarURL("png", 512) },
                color: this.resolveColor("#FF0000")
            },

            statistics: {
                ...this.makeBaseEmbed(null, T.statisticsembed.title),
                thumbnail: { url: this.nay.user.dynamicAvatarURL("png", 512) },
                fields: [
                    {
                        name: T.statisticsembed.fields[0],
                        value: String(this.nay.guilds.size).encode("js"),
                        inline: true
                    },
                    {
                        name: T.statisticsembed.fields[1],
                        value: String(this.nay.usersCount).encode("js"),
                        inline: true
                    },
                    {
                        name: T.statisticsembed.fields[2],
                        value: `# ${this.nay.instance}`.encode("md")
                    },
                    {
                        name: T.statisticsembed.fields[3],
                        value: String(this.nay.cmdHand.toJSON().filter(c => !c.acess?.forDevs).length).encode("fix"),
                        inline: true
                    },
                    {
                        name: T.statisticsembed.fields[4],
                        value: String(await this.botSettings.doc("totalCommands").get("all") ?? 0).encode("fix"),
                        inline: true
                    },
                    {
                        name: T.statisticsembed.fields[5],
                        value: `# ${pkg.version}`.encode("md")
                    },
                    {
                        name: T.statisticsembed.fields[6],
                        value: `- ${await interaction.member?.guild.doc.get("commands") ?? 0}`.encode("diff"),
                        inline: true
                    },
                    {
                        name: T.statisticsembed.fields[7],
                        value: `- ${await interaction.author.doc.get("commands") ?? 0}`.encode("diff"),
                        inline: true
                    }
                ]
            },

            status: {
                ...this.makeBaseEmbed(null, T.statusembed.title),
                thumbnail: { url: this.nay.user.dynamicAvatarURL("png", 512) },
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
                        value: `- ${this.nay.formattedUptime(t)}`.encode("diff")
                    },
                    {
                        name: T.statusembed.fields[2],
                        value: `# ${process.version}`.encode("md"),
                        inline: true
                    },
                    {
                        name: T.statusembed.fields[3],
                        value: `# ${pkg.dependencies.eris.replace("^", "v")}`.encode("md"),
                        inline: true
                    }
                ]
            }
        };

        const message = await interaction.reply({ embed: this.makeBaseEmbed(T.embed.description, T.embed.title, this.nay.user.dynamicAvatarURL("png", 512)) }, [
            {
                type: "menu",
                name: "botinfomenu",
                options: [
                    {
                        label: "Nay",
                        value: "bot",
                        description: T.menuoptions.first.description,
                        emoji: "💜"
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

        message.createComponentCollector({
            disableOnEnd: true,
            onlyAuthor: true
        }, option => message.edit({ embed: embeds[option.data.values[0]] }));
    }

};