const Command = require("../../../structures/Command");
const cld = require("child_process").exec;

module.exports = class CldCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    execute (interaction) {
        let cmdline = interaction.getOptionValue("args");
        const startTime = Date.now();
        cmdline ??= process.platform === "linux" ? "pwd" : "echo %cd%";

        cld(cmdline, (err, stdout, stderr) => {
            if (err) return interaction.createError(`Erro na execução do comando:\n\`${err}\``);
            if (stderr) return interaction.createError(`Erro na execução da linha de comando:\n\`${err}\``);
            const embed = this.makeBaseEmbed(stdout.encode("sh"), "Executado com sucesso");
            embed.footer.text = `${Date.now() - startTime}ms`;
            interaction.reply({ embed });
        });
    }

};