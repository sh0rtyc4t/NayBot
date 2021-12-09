const util = require("util");
module.exports = async function (message) {
    const prefix = "%";
    const content = message.content.split(" ");

    if (content[0] === `${prefix}eval` && ctx.config.owners.includes(message.author.id)) {
        let text = content.slice(1).join(" ")
            .split(/\r?\n/);
        const last = text.pop();
        text.push(`return ${last}`);
        text = text.join("\n");

        try {
            const evalued = util.inspect(await eval(`(async()=>{${text}\n})()`), { depth: 1 }).slice(0, 3960);
            nay.createMessage(message.channel.id, {
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
            nay.createMessage(message.channel.id, `Houve um erro na execução do eval:\n\`${e}\``);
        }
    }
};