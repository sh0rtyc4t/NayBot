const Base = require("./Base.js");

module.exports = class Logger extends Base {
    constructor (nay) {
        super();
        this.nay = nay;
    }

    async _getHooks (channelID, amount = 1) {
        const channel = await this.nay.getChannel(channelID);
        if (!channel) return [];
        const webhooks = await channel.getWebhooks();
        return amount === 1
            ? webhooks.at(0)
            : webhooks.slice(0, amount);
    }

    async init () {
        this.alertHook = await this._getHooks(this.config.alertsLogChannel);
        this.dmHook = await this._getHooks(this.config.dmLogChannel);
        this.guildsHooks = await this._getHooks(this.config.guildsLogChannel, 2);
    }

    error (stack, options = {}, interaction) {
        if (options.webhook) {
            this.alertLog(stack, "Error", interaction);
        }

        if (isObject(stack)) this.nay.debugMode
            ? stack = stack.stack
            : stack = stack.message;
        console.error(`\x1B[37m\x1B[41m[ ERROR ] - ${stack}\x1B[49m\x1B[39m`);

    }

    warn (stack, options = {}, interaction) {
        if (options.webhook) {
            this.alertLog(stack, "Warn", interaction);
        }

        console.warn(`\x1B[30m\x1B[43m[ WARNING ] - ${stack.message ?? stack}\x1B[49m\x1B[39m`);
    }

    debug (message) {
        console.debug(`\x1B[37m\x1B[45m[ DEBUG ] - ${message}\x1B[49m\x1B[39m`);
    }

    commandControl (logType, commandName, isDev) {
        let message = null;
        isDev = isDev ? " de desenvolvedores" : " global";
        switch (logType) {
        case "create":
            message = `Criando o comando${isDev}: "${commandName}"`;
            break;

        case "update":
            message = `Atualizando configurações no comando${isDev}: "${commandName}"`;
            break;

        case "delete":
            message = `Deletando o comando${isDev}: "${commandName}"`;
            break;
        }
        console.log(`\x1B[37m\x1B[44m[ COMMAND-CONTROL ] - ${message}\x1B[49m\x1B[39m`);
    }

    dmLog (message) {
        const embed = {
            color: this.resolveColor(this.config.baseColor),
            title: `${message.author.tag} | ${message.author.id}`,
            thumbnail: { url: message.author.dynamicAvatarURL(null, 512)},
            description: (message.content || "Sem conteudo").encode("diff"),
            footer: {
                icon_url: this.nay.user.dynamicAvatarURL("png", 512),
                text: `Menssagem em DM de ${this.nay.user.tag}`
            }
        };

        if (message.attachments.length === 1) embed.image = { url: message.attachments[0].proxy_url };

        if (message.attachments.length > 1 || message.attachments[0]?.content_type?.startsWith("video")) {
            embed.fields = [];
            const [images, videos, files] = message.attachments.reduce((arr, el) => {
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
            }, [
                [],
                [],
                []
            ]);

            !images.isEmpty && embed.fields.push({
                name: "Imagens",
                value: images.map(attach => `[${attach.filename}](${attach.proxy_url})`).join("\n")
            });

            !videos.isEmpty && embed.fields.push({
                name: "Videos",
                value: videos.map(attach => `[${attach.filename}](${attach.proxy_url})`).join("\n")
            });

            !files.isEmpty && embed.fields.push({
                name: "Arquivos",
                value: files.map(attach => `[${attach.filename}](${attach.proxy_url})`).join("\n")
            });
        }

        return this.nay.executeWebhook(this.dmHook.id, this.dmHook.token, { embed });
    }

    guildLog (logType, guild) {
        const gcEmbed = {
            ...this.makeBaseEmbed(null, "Novo Servidor"),
            color: this.resolveColor("#0AE714")
        };

        const gdEmbed = {
            ...this.makeBaseEmbed(null, "Servidor Perdido"),
            color: this.resolveColor("#F02525")
        };

        const embed = {
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
            ],
            ...logType === "create"
                ? gcEmbed
                : gdEmbed
        };

        const hook = logType === "create"
            ? this.guildsHooks[0]
            : this.guildsHooks[1];
        return this.nay.executeWebhook(hook.id, hook.token, { embed });
    }

    alertLog (stack, type = "Error", interaction) {
        const warnEmbed = {
            title: `${stack.name || "Warn"} x1`,
            color: this.resolveColor("#fce35a")
        };

        const errorEmbed = {
            title: `${stack.name || "Error"} x1`,
            color: this.resolveColor("#FF0000")
        };

        let embed = type === "Error"
            ? errorEmbed
            : warnEmbed;

        embed = {
            ...embed,
            timestamp: new Date(),
            description: (stack.message || stack).encode("js"),
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
                text: `${type} in: ${this.nay.instance}`
            }
        };
        if (!this.alertHook) return false;

        return this.nay.executeWebhook(this.alertHook.id, this.alertHook.token, {
            wait: true,
            embed
        });
    }
};