const Command = require("../../../structures/Command");
const cld = require("child_process").exec;

module.exports = class CldCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    execute (interaction) {
        let cmdline = interaction.data.options?.at(0)?.value;
        cmdline ??= process.platform === "linux" ? "pwd" : "echo %cd%";

        cld(cmdline, (err, stdout, stderr) => {
            console.log(err, stderr);
            const embed = this.makeBaseEmbed(stdout.encode("sh"), "Executado com sucesso");
            interaction.reply({ embed });
        });
    }

};