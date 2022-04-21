require("./src/utils/globals.js");
require("./src/modules/Database.js").init();
const config = require("./src/structures/Configurations.js");
const Locales = require("./src/modules/Locales.js");
const Prototypes = require("./src/utils/prototypes.js");
const Nay = require("./src/structures/Nay.js");
const nay = Nay.getBot(config);

// eslint-disable-next-line no-new
new Prototypes(nay);
new Locales().init();
nay.evtHand.linkAll();
nay.connect();

const emitError = u => nay.emit("error", u);
process.on("warning", w => nay.emit("warn", w));
process.on("uncaughtException", emitError);
process.on("unhandledRejection", emitError);