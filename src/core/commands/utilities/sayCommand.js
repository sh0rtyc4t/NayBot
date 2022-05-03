const Command = require("../../../structures/Command");

module.exports = class SayCommand extends Command {
    execute (interaction) {
        interaction.reply(interaction.getOptionValue("text") || "ﾠ");
    }

};