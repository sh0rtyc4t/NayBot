const Base = require("./Base.js");

module.exports = class Logger extends Base {
    constructor (nay) {
        super();
        this.nay = nay;
    }

    error (stack) {
        if (isObject(stack)) this.nay.debugMode
            ? stack = stack.stack
            : stack = stack.message;
        return console.error(`\x1B[37m\x1B[41m[ ERROR ] - ${stack}\x1B[49m\x1B[39m`);
    }

    warn (stack) {
        return console.warn(`\x1B[30m\x1B[43m[ WARNING ] - ${stack.message ?? stack}\x1B[49m\x1B[39m`);
    }

    debug (message) {
        return console.debug(`\x1B[37m\x1B[45m[ DEBUG ] - ${message}\x1B[49m\x1B[39m`);
    }

    info (message, preset, presetOptions) {
        if (preset) {
            if (preset === "commandcontroller") {
                let { name, actionType, isDev } = presetOptions;
                isDev = isDev ? "developers" : "global";
                switch (actionType) {
                    case "create":
                        message = `Creating the ${isDev} command: "${name}"`;
                        break;

                    case "update":
                        message = `Update settings in the ${isDev} command: "${name}"`;
                        break;

                    case "delete":
                        message = `Deleting the ${isDev} command: "${name}"`;
                        break;
                }
                return console.log(`\x1B[37m\x1B[44m[ COMMAND-CONTROL ] - ${message}\x1B[49m\x1B[39m`);
            }
        }

        return console.log(`\x1B[37m\x1B[44m[ INFO ] - ${message}\x1B[49m\x1B[39m`);

    }
};