const security = require("../../config/security.json");
const settings = require("../../config/settings.json");
const fs = require("fs");
const Eris = require("eris");
const path = require("path");
const instance = process.argv.includes("--development")
    ? "nightly"
    : "nay";
const db = require("../modules/Database.js")(security[instance].firebaseConfig);

module.exports = class Base {
    constructor (nay) {
        this.nay = nay;
        this.instance = instance;
        this.config = {
            ...settings,
            ...security[this.instance],
            ...security.any
        };
        this.db = db;
        this.modules = {
            fs,
            Eris,
            path
        };
    }

    resolvePath (...args) {
        return path.resolve(...args);
    }

    resolveColor (color) {
        return parseInt(color.replace("#", ""), 16);
    }

    makeBaseEmbed (description, title, thumbnail) {
        return {
            title,
            color: this.resolveColor(this.config.baseColor),
            description,
            timestamp: new Date(),
            thumbnail: { url: thumbnail },
            footer: {
                icon_url: this.nay.user.dynamicAvatarURL("png", 512),
                text: this.nay.user.tag
            }
        };
    }
};