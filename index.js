const Eris = require("eris");
const path = require("path");
const Nay = require("./src/core/Client.js");
const security = require("./config/security.json");
const settings = require("./config/settings.json");

const cmdLineArgs = process.argv.slice(2);

let instance = "nay";
if (cmdLineArgs.includes("--dev")) instance = "nightly";

const config = {
    ...security[instance],
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
    instance
});

nay.initiate().then(() => nay.loadCore());