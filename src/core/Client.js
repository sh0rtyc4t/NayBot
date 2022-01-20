const { Client, Collection, Constants } = require("eris");
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

    sendMessage (channel, options, components) {
        if (typeof options === "string" || typeof options === "number") options = { content: String(options) };

        const files = [];

        if (components) {

            for (const component of components) {
                if (component.type === "file") {
                    files.push({
                        name: component.name,
                        file: component.file || fs.readFileSync(component.path) || "Empty"
                    });
                    continue;

                } else if (component.type === "but") {
                    component.type = Constants.ComponentTypes.BUTTON;
                    component.style = component.url
                        ? Constants.ButtonStyles.LINK
                        : Number(component.style
                            .replace("red", Constants.ButtonStyles.DANGER)
                            .replace("green", Constants.ButtonStyles.SUCCESS)
                            .replace("blurple", Constants.ButtonStyles.PRIMARY)
                            .replace("grey", Constants.ButtonStyles.SECONDARY));

                } else if (component.type === "menu") {
                    component.type = Constants.ComponentTypes.SELECT_MENU;
                    component.placeholder = component.label;
                    delete component.label;
                    component.min_values = component.values?.at(0) || 1;
                    component.max_values = component.values?.at(1) || 1;
                    // eslint-disable-next-line no-return-assign
                    component.options.forEach(op => op.value ??= op.label.toLowerCase());
                }
                component.custom_id = component.name;
                delete component.name;
            }

            options.components = [
                {
                    type: 1,
                    components
                }
            ];

        }

        return typeof channel === "object"
            ? channel.createMessage(options, files)
            : nay.createMessage(channel, options, files);
    }
};