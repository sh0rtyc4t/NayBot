/* eslint-disable no-unused-vars */
const util = require("util");
const i18 = require("i18next");
const cld = require("child_process");

module.exports = async function (message) {
    const prefix = ctx.config.prefix;
    const content = message.content.split(" ");
    const t = i18.getFixedT(message.member?.guild?.preferredLocale || "en-US");

    if (content[0] === `${prefix}eval` && ctx.config.owners.includes(message.author.id)) {
        let text = content.slice(1).join(" ")
            .split(/\r?\n/);
        const last = text.pop();
        text.push(`return ${last}`);
        text = text.join("\n");

        try {
            const evalued = util.inspect(await eval(`(async()=>{${text}\n})()`), { depth: 1 }).slice(0, 3960);
            return message.channel.createMessage({ embeds: [new ctx.BaseEmbed(`\`\`\`js\n${evalued}\`\`\``, "Eval")] });
        } catch (e) {
            return message.channel.createMessage(`Houve um erro na execução do eval:\n\`${e}\``);
        }
    }

    if (message.content.match(/^\?\?./)) {
        return message.channel.createMessage({ embeds: [new ctx.BaseEmbed(t("miscellany:alert-slash"), "Changes...")]});
    }

    if (!message.guildID) {
        const embed = {
            color: ctx.resolveColor("FF0000"),
            title: message.author.tag,
            thumbnail: { url: message.author.dynamicAvatarURL(null, 512)},
            description: `\`\`\`diff\n- ${message.content || "Sem conteudo"}\`\`\``,
            footer: {
                icon_url: nay.user.avatarURL,
                text: `Menssagem em DM de ${nay.user.tag}`
            }
        };

        if (message.attachments.length === 1) embed.image = { url: message.attachments[0].proxy_url };
        hooks.dmLog({ embeds: [embed] });

        if (message.attachments.length > 1 || message.attachments[0].content_type.startsWith("video")) {
            const embedMidia = new ctx.BaseEmbed(null, "Arquivos da menssagem acima:");
            const fields = [];
            const videos = [];
            const images = [];
            const files = [];

            for (const attach of message.attachments) {
                if (attach.content_type.startsWith("video")) {
                    videos.push(`[${attach.filename}](${attach.proxy_url})`);
                    continue;
                }

                if (attach.content_type.startsWith("image")) {
                    images.push(`[${attach.filename}](${attach.proxy_url})`);
                    continue;
                }

                files.push(`[${attach.filename}](${attach.proxy_url})`);
            }


            if (videos.length) fields.push({
                name: "Videos",
                value: videos.join("\n")
            });

            if (images.length) fields.push({
                name: "Imagens",
                value: images.join("\n")
            });

            if (files.length) fields.push({
                name: "Arquivos",
                value: files.join("\n")
            });

            embedMidia.fields = fields;
            hooks.dmLog({ embeds: [embedMidia] });
        }
    }
};