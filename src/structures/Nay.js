const { Client, Constants } = require("eris");
const { readFileSync } = require("fs");
const CommandHandler = require("../core/handlers/CommandHandler.js");
const EventHandler = require("../core/handlers/EventHandler.js");
const Logger = require("./Logger.js");

module.exports = class Nay extends Client {
    constructor (token, ClientOptions) {
        super(token, ClientOptions);
        this.instance = ClientOptions.instance;
        this.cmdHand = new CommandHandler(this);
        this.evtHand = new EventHandler(this);
        this.isDev = this.instance === "nightly";
        this.log = new Logger(this);
        this.emojis = require("../../config/emojis.json");
        this.debugMode = process.argv.includes("--debug");
    }

    get usersCount () {
        return this.guilds.reduce((ac, g) => ac += g.memberCount, 0);
    }

    sendMessage (channel, options, components) {
        if (typeof options === "string" || typeof options === "number") options = { content: String(options) };

        const files = [];

        if (components) {

            for (const component of components) {
                if (component.type === "file") files.push({
                    name: component.name,
                    file: component.file || readFileSync(component.path) || "Empty"
                });

                else if (component.type === "but") {
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
                    component.options.forEach(op => {
                        if (typeof op.emoji === "string") op.emoji = { name: op.emoji };
                        op.value ??= op.label.toLowerCase();
                    });
                }
                component.custom_id = component.name;
                delete component.name;
            }

            options.components = [
                {
                    type: 1,
                    components: components.filter(c => c.type !== "file")
                }
            ];

        }

        return isObject(channel)
            ? channel.createMessage(options, files)
            : this.createMessage(channel, options, files);
    }
};