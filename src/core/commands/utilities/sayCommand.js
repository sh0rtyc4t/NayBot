const Command = require("../../../structures/Command");

module.exports = class SayCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    execute (interaction) {
        interaction.reply(interaction.getOptionValue("text") || "ﾠ");
    }

};