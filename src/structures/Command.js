const Base = require("./Base.js");

module.exports = class Command extends Base {
    constructor (nay) {
        super();
        this.nay = nay;
    }

    execute (interaction, t) {
        if (!isObject(interaction) || typeof t !== "function") return this.nay.emit("error", "Command executed without necessary parameters");
        interaction.createError(t("errors:commandNotFound"));
    }
};