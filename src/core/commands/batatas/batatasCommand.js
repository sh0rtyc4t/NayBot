const Command = require("../../../structures/Command");

module.exports = class BatatasCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    async execute (interaction, t) {
        const user = await interaction.getOptionUser() || interaction.author;
        const batatas = await user.doc.get("batatas");

        return interaction.reply({
            embed: this.makeBaseEmbed(t("commands:batatas.embed.description", {
                batatas: batatas || 0,
                tag: user.tag
            }), t("commands:batatas.embed.title"), user.avatarURL)
        });
    }
};