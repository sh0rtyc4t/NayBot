const BotClient = require("./src/structures/BotClient.js");
const Locales = require("./src/modules/Locales.js");
const Prototypes = require("./src/utils/prototypes.js");

const nay = new BotClient().getBot();

// eslint-disable-next-line no-new
new Prototypes(nay);
new Locales().init();
nay.evtHand.linkAll();
nay.connect();

const emitError = u => nay.emit("error", u);
process.on("warning", w => nay.emit("warn", w));
process.on("uncaughtException", emitError);
process.on("unhandledRejection", emitError);