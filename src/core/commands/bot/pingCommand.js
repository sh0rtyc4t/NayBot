const Command = require("../../../structures/Command");

module.exports = class PingCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    execute (interaction, t) {
        const embed = this.nay.utils.makeEmbed(`🏓 ┃ ${t("commands:ping", { latency: this.nay.requestHandler.latencyRef.latency })}`, "Pong!");
        interaction.createMessage({ embeds: [embed] });
    }

};