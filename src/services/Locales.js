const Base = require("../structures/Base.js");
const i18n = require("i18next");
i18n.use(require("i18next-fs-backend"));

module.exports = class Locales extends Base {
    constructor () {
        super();
        this.i18n = i18n;
    }

    init () {
        i18n.init({
            ns: [
                "commands",
                "events",
                "errors",
                "misc"
            ],
            preload: this.modules.fs.readdirSync(global.resolvePath("./src", "locales")),
            fallbackLng: "en-US",
            backend: { loadPath: global.resolvePath("./src", "locales", "{{lng}}/{{ns}}.json") },
            interpolation: { escapeValue: false },
            returnEmptyString: false
        });
    }
};