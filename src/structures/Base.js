const security = require("../../config/security.json");
const settings = require("../../config/settings.json");
const fs = require("fs");
const Eris = require("eris");
const path = require("path");
const instance = process.argv.includes("--development")
    ? "nightly"
    : "nay";
const db = require("../modules/Database.js")(security[instance].firebaseConfig);
const botSettings = db.collection("botSettings");
botSettings.doc("totalCommands").create({ all: 0 })
    .catch(Function());

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
        this.botSettings = botSettings;
    }

    makeBaseEmbed (description, title, thumbnail) {
        return {
            title,
            color: global.resolveColor(this.config.baseColor),
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