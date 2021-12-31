/* eslint-disable no-unused-vars */
const util = require("util");
const i18 = require("i18next");
const cld = require("child_process");

module.exports = async function (message) {
    const prefix = ctx.config.prefix;
    const content = message.content.split(" ");
    const t = i18.getFixedT(message.member?.guild?.preferredLocale || "en-US");

    if (message.content.match(/^\?\?./)) {
        return nay.createMessage(message.channel.id, { embeds: [new ctx.BaseEmbed(t("miscellany:alert-slash"), "Changes...")]});
    }

    if (content[0] === `${prefix}eval` && ctx.config.owners.includes(message.author.id)) {
        let text = content.slice(1).join(" ")
            .split(/\r?\n/);
        const last = text.pop();
        text.push(`return ${last}`);
        text = text.join("\n");

        try {
            const evalued = util.inspect(await eval(`(async()=>{${text}\n})()`), { depth: 1 }).slice(0, 3960);
            return nay.createMessage(message.channel.id, {
                embeds: [
                    {
                        title: "Eval",
                        color: ctx.resolveColor("FF0000"),
                        description: `\`\`\`js\n${evalued}\`\`\``,
                        timestamp: new Date()
                    }
                ]
            });
        } catch (e) {
            return nay.createMessage(message.channel.id, `Houve um erro na execução do eval:\n\`${e}\``);
        }
    }

    if (!message.guildID) {
        const embed = {
            color: ctx.resolveColor("FF0000"),
            title: message.author.tag,
            thumbnail: { url: message.author.dynamicAvatarURL(null, 512)},
            description: `\`\`\`diff\n- ${message.content}\`\`\``,
            footer: {
                icon_url: nay.user.avatarURL,
                text: `Menssagem em DM de ${nay.user.tag}`
            }
        };

        hooks.dmLog({ embeds: [embed] });
    }
};