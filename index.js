require("./src/utils/prototypes.js");
require("./src/utils/globals.js");
require("./src/core/database/index.js");
const config = require("./src/structures/Configurations.js");
const Locales = require("./src/services/Locales.js");
const Nay = require("./src/structures/Nay.js");
const nay = Nay.getBot(config);

new Locales().init();
nay.evtHand.linkAll();
nay.connect();

const emitError = u => nay.emit("error", u);
process.on("warning", w => nay.emit("warn", w));
process.on("uncaughtException", emitError);
process.on("unhandledRejection", emitError);