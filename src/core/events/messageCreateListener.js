/* eslint-disable no-unused-vars */
const util = require("util");
const i18 = require("i18next");
const cld = require("child_process");
const fs = require("fs");
const bytes = require("bytes");
const os = require("os");
const hd = require("humanize-duration");
const osu = require("node-os-utils");
const Event = require("../../structures/Event");

module.exports = class MessageCreateEvent extends Event {
    constructor (nay) {
        super(nay);
    }

    async on (message) {
        if (!message.guildID && message.type !== 20) return this.nay.log.dmLog(message);
        const prefix = this.config.prefix;
        const content = message.content?.split(" ");
        const args = content.slice(1);
        const t = i18.getFixedT(message.member?.guild?.preferredLocale || "en-US");

        if (content[0] === `${prefix}eval` && this.config.owners.includes(message.author.id)) return this.executeEval(args, message);
        if (message.content.match(/^\?\?./) && !message.author.bot) return message.channel.createMessage({ embed: this.makeBaseEmbed(t("misc:alert-slash"), "Changes...") });
        if (message.channel.id === this.config.dmLogChannel && content[0] && !isNaN(content[0]) && content[0].length === 18 && !message.author.bot) {
            try {
                const channel = await (await this.nay.getRESTUser(content[0])).getDMChannel();
                if (message.attachments) for (const attach of message.attachments) args.push(`\n${attach.proxy_url}`);
                channel.createMessage(args.join(" "));
            } catch (err) {
                message.channel.createMessage("Houve um erro ao enviar esta menssagem");
            }
        }

    }

    async executeEval (args, message) {
        let depth = 2;
        const params = args.filter(a => (/^-[a-zA-Z]/m).test(a));
        args = args.slice(params.length)
            .join(" ")
            .split(/\r?\n/);

        const lastIndex = args.length - 1;
        const returnment = args[lastIndex];

        params.includes("-nr")
            ? args.push("return undefined;")
            : args[lastIndex] = `return ${returnment}`;

        params.forEach(p => (p.startsWith("-depth")
            ? depth = Number(p.slice(7))
            : null));

        const isStrict = params.includes("-strict")
            ? "\n\"use strict\";"
            : "";

        try {
            const startTime = Date.now();
            const evalued = util.inspect(await eval(`${isStrict}\n(async()=>{\n${args.join("\n")}\n})()`), { depth }).slice(0, 3990);
            const evalEmbed = this.makeBaseEmbed(evalued.encode("js"), "Eval");
            evalEmbed.footer.text = `${Date.now() - startTime}ms`;
            return message.channel.createMessage({ embeds: [evalEmbed] });
        } catch (error) {
            return message.channel.createMessage(`Houve um erro na execução do eval:\n\`${error}\``);
        }
    }
};