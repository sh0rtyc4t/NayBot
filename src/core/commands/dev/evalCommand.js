const util = require("util");
const Command = require("../../../structures/Command");

module.exports = class EvalCommand extends Command {
    async execute (interaction) {
        // eslint-disable-next-line prefer-const
        let { strict, noreturn, depth, code } = interaction.data.options.reduce((a, o) => {
            a[o.name] = o.value;
            return a;
        }, {});
        code = code.split(" ");

        depth ??= 2;
        strict
            ? strict = "\"use strict\";"
            : strict = "";

        code[code.length - 1] = noreturn
            ? "return undefined;"
            : `return ${code.at(-1)}`;

        try {
            const evalued = util.inspect(await eval(`${strict}\n(async()=>{${code.join(" ")}})();`), { depth }).slice(0, 3990);
            return interaction.reply({ embeds: [this.nay.utils.makeEmbed(evalued.encode("js"), "Eval")] });
        } catch (error) {
            return interaction.reply(`Houve um erro na execução do eval:\n\`${error}\``);
        }
    }

};