const Command = require("../../../structures/Command");

module.exports = class AvatarCommand extends Command {
    constructor (nay) {
        super(nay);
        this.nay = nay;
    }

    async execute (interaction) {
        const user = await interaction.getOptionUser() || interaction.author;
        const embed = this.nay.utils.makeEmbed(null, user.tag);
        embed.image = { url: user.dynamicAvatarURL(null, 1024) };
        interaction.reply({ embed });
    }

};