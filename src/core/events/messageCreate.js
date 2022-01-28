/* eslint-disable no-unused-vars */
const util = require("util");
const i18 = require("i18next");
const cld = require("child_process");
const fs = require("fs");
const bytes = require("bytes");
const os = require("os");
const moment = require("moment");

module.exports = async function (message) {
    const prefix = ctx.config.prefix;
    const content = message.content.split(" ");
    const t = i18.getFixedT(message.member?.guild?.preferredLocale || "en-US");

    if (content[0] === `${prefix}eval` && ctx.config.owners.includes(message.author.id)) {
        let text = content.slice(1);
        const params = text.filter(a => a.startsWith("-"));
        text = text.slice(params.length).join(" ")
            .split(/\r?\n/);
        const last = text.pop();
        text.push(params.includes("-nr")
            ? `${last}\nreturn undefined`
            : `return ${last}`);
        text = text.join("\n");

        try {
            const evalued = util.inspect(await eval(`(async()=>{${text}\n})()`), { depth: params.find(p => p.startsWith("-depth="))?.slice(7) ?? 1 }).slice(0, 3960);
            return message.channel.createMessage({ embeds: [new ctx.BaseEmbed(evalued.encode("js"), "Eval")] });
        } catch (e) {
            return message.channel.createMessage(`Houve um erro na execução do eval:\n\`${e}\``);
        }
    }

    if (message.content.match(/^\?\?./) && !message.author.bot) {
        return message.channel.createMessage({ embeds: [new ctx.BaseEmbed(t("miscellany:alert-slash"), "Changes...")]});
    }

    if (message.channel.id === ctx.config.dmchannel && content[0] && !content[0].startsWith("//") && !message.author.bot) {
        try {
            const channel = await (await nay.getRESTUser(content[0])).getDMChannel();
            const text = content.slice(1);
            if (message.attachments) for (const attach of message.attachments) text.push(`\n${attach.proxy_url}`);

            channel.createMessage(text.join(" "));
        } catch (err) {
            message.channel.createMessage("Houve um erro ao enviar esta menssagem");
        }
    }

    if (!message.guildID) return executeDMLog(message);
};

function executeDMLog (message) {
    const embed = {
        color: ctx.resolveColor(ctx.config.baseColor),
        title: `${message.author.tag} | ${message.author.id}`,
        thumbnail: { url: message.author.dynamicAvatarURL(null, 512)},
        description: (message.content || "Sem conteudo").encode("diff"),
        footer: {
            icon_url: nay.user.avatarURL,
            text: `Menssagem em DM de ${nay.user.tag}`
        }
    };

    if (message.attachments.length === 1) embed.image = { url: message.attachments[0].proxy_url };

    if (message.attachments.length > 1 || message.attachments[0]?.content_type?.startsWith("video")) {
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

        embed.fields = fields;
    }

    return ctx.hooks.dmLog({ embeds: [embed] });
}