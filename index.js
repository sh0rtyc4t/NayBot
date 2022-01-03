const Eris = require("eris");
const path = require("path");
const Nay = require("./src/core/Client.js");
const security = require("./config/security.json");
const settings = require("./config/settings.json");
const cmdLineArgs = process.argv.slice(2);

let instance = "nay";
// replace "nay" to your bot name
if (cmdLineArgs.includes("--dev")) instance = "nightly";
// if you have a test bot, replace "nightly" to your test bot name

const config = {
    ...security[instance],
    ...security.any,
    ...settings
};


global.ctx = {
    Eris,
    mainDir: __dirname,
    path,
    config
};

global.nay = new Nay(`Bot ${config.token}`, {
    intents: config.intents,
    maxShards: 1,
    restMode: true,
    instance
});

nay.initiate().then(() => nay.loadCore());