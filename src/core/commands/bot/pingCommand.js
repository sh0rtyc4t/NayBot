module.exports = function (interaction) {
    const embed = new ctx.BaseEmbed(`🏓 ┃ ${t("commands:ping", { latency: nay.requestHandler.latencyRef.latency })}`, "Pong!");
    interaction.reply({ embeds: [embed] });
};