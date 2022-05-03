const Event = require("../../structures/Event");

module.exports = class ReadyEvent extends Event {
    async once () {
        await this.nay.hooklog.init();
        this.nay.cmdHand.deployAll();
        if (!this.nay.isDev) (await this.nay.getChannel(this.config.serversCountChannel)).join();
        return console.log(`Online in ${this.nay.user.tag}`);
    }
};