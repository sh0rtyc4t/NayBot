const Command = require("../../../structures/Command");

module.exports = class AvatarCommand extends Command {
    constructor (nay) {
        super(nay);
        this.nay = nay;
    }

    async execute (interaction) {
        const user = interaction.data.options
            ? await this.nay.getRESTUser(interaction.data.options[0].value)
            : interaction.member.user;
        const embed = this.makeBaseEmbed(null, user.tag);
        embed.image = { url: user.dynamicAvatarURL(null, 1024) };
        interaction.reply({ embed });
    }

};