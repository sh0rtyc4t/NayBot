module.exports = function (interaction) {
    interaction.createMessage(t("commands:ping", { latency: nay.requestHandler.latencyRef.latency }));
};