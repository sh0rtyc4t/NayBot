const { Client } = require("eris");
const fs = require("fs");

module.exports = class Nay extends Client {
    constructor (token, ClientOptions) {
        super(token, ClientOptions);
        this.instance = ClientOptions.instance;
        this.emojis = require(`${ctx.mainDir}/config/emojis.json`);
        this.commands = require(`${ctx.mainDir}/config/commands.json`);
    }

    loadCore () {
        require(`${ctx.mainDir}/src/core/handlers/putCommands.js`)();
        require(`${ctx.mainDir}/src/core/handlers/loadEvents.js`)();
        require(`${ctx.mainDir}/src/modules/locales.js`)();

        // eslint-disable-next-line new-cap
        const db = new (require(`${ctx.mainDir}/src/modules/Database.js`))(ctx.config.firebaseConfig);
        db.connect();
        global.db = db;
    }

    initiate () {
        return new Promise((res, rej) => {
            this.loadUtils();
            this.once("ready", () => res());
            try {
                this.connect();
            } catch (e) {
                rej(new Error("Error on iniciate Client"));
            }
        });
    }

    loadUtils () {
        require(`${ctx.mainDir}/src/utils/prototypes.js`);

        const files2 = fs.readdirSync(`${ctx.mainDir}/src/utils/functions`);
        for (const file of files2) require(`${ctx.mainDir}/src/utils/functions/${file}`);
    }
};