const security = require("../../config/security.json");
const settings = require("../../config/settings.json");

class Configuration {
    constructor () {
        this.config = null;
        this.enviromentType = process.argv.includes("--development") ? "development" : "production";
        this.setup();
    }

    setup () {
        return this.config = {
            ...settings,
            ...security[this.enviromentType],
            ...security.any,
            enviromentType: this.enviromentType
        };
    }

}

module.exports = new Configuration().config;