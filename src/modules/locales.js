const { readdirSync } = require("fs");
const i18next = require("i18next");
i18next.use(require("i18next-fs-backend"));

module.exports = function () {
    i18next.init({
        ns: [
            "commands",
            "events",
            "errors",
            "miscellany"
        ],
        preload: readdirSync(`${ctx.mainDir}/src/locales`),
        fallbackLng: "en-US",
        backend: {
            loadPath: `${ctx.mainDir}/src/locales/{{lng}}/{{ns}}.json`
        },
        interpolation: {
            escapeValue: false
        },
        returnEmptyString: false
    });
};