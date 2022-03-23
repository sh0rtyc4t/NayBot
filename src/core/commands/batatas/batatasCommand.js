const Command = require("../../../structures/Command");

module.exports = class BatatasCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    async execute (interaction, t) {
        let batatas = await interaction.author.get("batatas");
        let user = interaction.member.user;

        if (interaction.data.options?.at(0)?.value) {
            user = await this.nay.getRESTUser(interaction.data.options[0].value);
            batatas = await this.db.users.doc(user.id).get("batatas");
        }

        interaction.reply({
            embed: this.makeBaseEmbed(t("commands:batatas.embed.description", {
                batatas: batatas || 0,
                tag: user.tag
            }), t("commands:batatas.embed.title"), user.avatarURL)
        });
    }

};