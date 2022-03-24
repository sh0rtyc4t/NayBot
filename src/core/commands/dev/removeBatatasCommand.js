const Command = require("../../../structures/Command");

module.exports = class RemoveBatatasCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    async execute (interaction) {
        const userDoc = this.db.users.doc(await interaction.getOptionUser());

        if (!await userDoc.exists()) return interaction.createError("Usuário não existente não banco de dados");
        await userDoc.subtract("batatas", interaction.getValue("amount"));
        interaction.reply("Removido");
    }

};