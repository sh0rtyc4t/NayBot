module.exports = async function (interaction) {
    const user = interaction.data.options
        ? await nay.getRESTUser(interaction.data.options[0].value)
        : interaction.member.user;
    const embed = new ctx.BaseEmbed(null, user.tag);
    embed.image = {url: user.dynamicAvatarURL(null, 1024)};
    interaction.createMessage({ embeds: [embed] });
};