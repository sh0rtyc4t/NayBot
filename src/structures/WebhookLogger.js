const Base = require("./Base");

module.exports = class WebhookLogger extends Base {
    async _getHooks (channelID, limit = 1) {
        const channel = await this.nay.getChannel(channelID);
        if (!channel) return [];
        const webhooks = await channel.getWebhooks();
        return limit === 1
            ? webhooks.at(0)
            : webhooks.slice(0, limit);
    }

    async init () {
        this.alertHook = await this._getHooks(this.config.alertsLogChannel);
        this.dmHook = await this._getHooks(this.config.dmLogChannel);
        this.guildsHook = await this._getHooks(this.config.guildsLogChannel, 2);
    }

    dm (message) {
        if (!this.dmHook || !message?.author) return false;

        const embed = {
            color: this.nay.utils.resolveColor(this.config.baseColor),
            title: `${message.author.tag} | ${message.author.id}`,
            thumbnail: { url: message.author.dynamicAvatarURL(null, 512)},
            description: (message.content || "Sem conteudo").encode("diff"),
            footer: {
                icon_url: this.nay.user.dynamicAvatarURL("png", 512),
                text: `Message on DM from ${this.nay.user.tag}`
            }
        };

        if (message.attachments.length === 1 && message.attachments[0]?.content_type.startsWith("image")) embed.image = { url: message.attachments[0].proxy_url };
        if (message.attachments.length > 1 || message.attachments[0]?.content_type.startsWith("video")) {
            embed.fields = [];
            const attachs = message.attachments.reduce((arr, el) => {
                switch (el.content_type.split("/")[0]) {
                    case "image":
                        arr[0].push(el);
                        break;

                    case "video":
                        arr[1].push(el);
                        break;

                    default:
                        arr[2].push(el);
                        break;
                }
                return arr;
            }, [[], [], []]);
            const [images, videos, files] = attachs.map(el => el.map(attach => `[${attach.filename}](${attach.proxy_url})`).join("\n"));

            !images.isEmpty && embed.fields.push({
                name: "Imagens",
                value: images
            });

            !videos.isEmpty && embed.fields.push({
                name: "Videos",
                value: videos
            });

            !files.isEmpty && embed.fields.push({
                name: "Arquivos",
                value: files
            });
        }

        return this.nay.executeWebhook(this.dmHook.id, this.dmHook.token, { embed });
    }

    guild (logType, guild) {
        const gcEmbed = {
            ...this.nay.utils.makeEmbed(null, "Guild Join"),
            color: this.nay.utils.resolveColor("#0AE714")
        };

        const gdEmbed = {
            ...this.nay.utils.makeEmbed(null, "Guild Leave"),
            color: this.nay.utils.resolveColor("#F02525")
        };

        const embed = {
            image: { url: guild.dynamicIconURL(null, 1024) },
            fields: [
                {
                    name: "Guild",
                    value: `- ${guild.name} ┃ ${guild.id}`.encode("diff")
                },
                {
                    name: "Owner",
                    value: `${guild.ownerID}`.encode("fix")
                },
                {
                    name: "Member Count",
                    value: `${guild.memberCount}`.encode("js")
                }
            ],
            ...logType === "create" ? gcEmbed : gdEmbed
        };

        const hook = logType === "create" ? this.guildsHooks.at(0) : this.guildsHooks.at(1);
        if (!hook) return false;
        return this.nay.executeWebhook(hook.id, hook.token, { embed });
    }

    alert (stack, type = "Error") {
        const warnEmbed = {
            title: `${stack.name || "Warn"} x1`,
            color: this.nay.utils.resolveColor("#fce35a")
        };
        const errorEmbed = {
            title: `${stack.name || "Error"} x1`,
            color: this.nay.utils.resolveColor("#FF0000")
        };

        let embed = type === "Error" ? errorEmbed : warnEmbed;
        embed = {
            ...embed,
            timestamp: new Date(),
            description: (stack.message || stack).encode("js"),
            footer: {
                text: `${type} in: ${this.nay.enviromentType}`
            }
        };

        if (!this.alertHook) return false;
        return this.nay.executeWebhook(this.alertHook.id, this.alertHook.token, {
            wait: true,
            embed
        });
    }
};