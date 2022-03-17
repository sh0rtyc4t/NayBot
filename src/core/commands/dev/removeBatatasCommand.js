const Command = require("../../../structures/Command");

module.exports = class RemoveBatatasCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    async execute (interaction) {
        const user = interaction.data.options[0].value;
        const amount = interaction.data.options.at(1)?.value;
        const userDoc = this.db.users.doc(user);

        if (!await userDoc.exists()) return interaction.createError("Usuário não existente não banco de dados");
        await userDoc.subtract("batatas", amount);
        interaction.reply("Removido");
    }

};