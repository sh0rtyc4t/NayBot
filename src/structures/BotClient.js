const Nay = require("./Nay.js");
const Base = require("./Base.js");

module.exports = class BotClient extends Base {
    // eslint-disable-next-line no-useless-constructor
    constructor () {
        super();
    }

    getBot () {
        return this.nay
            ? this.nay
            : this.nay = new Nay(`Bot ${this.config.token}`, {
                instance: this.instance,
                intents: this.config.intents,
                restMode: true,
                maxShards: this.config.shardAmount ?? 1
            });
    }
};