const Command = require("../../../structures/Command");

module.exports = class AddPotatosCommand extends Command {
    async execute (interaction) {
        const userDoc = this.db.users.doc(await interaction.getOptionUser());

        if (!await userDoc.exists()) return interaction.createError("Usuário não existente não banco de dados");
        await userDoc.add("batatas", interaction.getValue("amount"));
        interaction.reply("Adicionado");
    }

};