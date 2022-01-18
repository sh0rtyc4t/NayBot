const { Client, Collection } = require("eris");
const fs = require("fs");

module.exports = class Nay extends Client {
    constructor (token, ClientOptions) {
        super(token, ClientOptions);
        this.instance = ClientOptions.instance;
        this.emojis = require(`${ctx.mainDir}/config/emojis.json`);
        this.commands = require(`${ctx.mainDir}/config/commands.json`);
        this.notes = new Collection("notes");
    }

    loadCore () {
        require(`${ctx.mainDir}/src/core/handlers/putCommands.js`)();
        require(`${ctx.mainDir}/src/modules/locales.js`)();

        // eslint-disable-next-line new-cap
        const db = new (require(`${ctx.mainDir}/src/modules/Database.js`))(ctx.config.firebaseConfig);
        db.connect();
        global.db = db;
    }

    initiate () {
        this.loadUtils();
        require(`${ctx.mainDir}/src/core/handlers/loadEvents.js`)();
        try {
            this.connect();
        } catch (e) {
            this.emit("error", "Error on iniciate Client");
        }
    }

    loadUtils () {
        require(`${ctx.mainDir}/src/utils/prototypes.js`);

        const files2 = fs.readdirSync(`${ctx.mainDir}/src/utils/functions`);
        for (const file of files2) require(`${ctx.mainDir}/src/utils/functions/${file}`);

        const HookLogs = require(`${ctx.mainDir}/src/modules/HookLogs.js`);
        ctx.hooks = new HookLogs(ctx.config.logWebhooks);
    }
};