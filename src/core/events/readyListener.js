const Event = require("../../structures/Event");

module.exports = class ReadyEvent extends Event {
    constructor (nay) {
        super(nay);
    }

    async once () {
        console.log("graças a deus online");
        await this.nay.log.init();
        this.nay.cmdHand.deployAll();
        if (!this.nay.isDev) (await this.nay.getChannel(this.config.serversCountChannel)).join();
    }
};