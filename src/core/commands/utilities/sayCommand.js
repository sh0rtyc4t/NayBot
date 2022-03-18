const Command = require("../../../structures/Command");

module.exports = class SayCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    execute (interaction) {
        const text = interaction.data.options?.at(0)?.value || "ﾠ";
        interaction.reply(text);
    }

};