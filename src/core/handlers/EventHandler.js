const Base = require("../../structures/Base.js");
const Event = require("../../structures/Event.js");

module.exports = class EventHandler extends Base {
    constructor (nay) {
        super();
        this.nay = nay;
        this.eventFiles = this.modules.fs.readdirSync(this.resolvePath("./src", "core/events/"));
        this.events = new this.modules.Eris.Collection("events");
    }

    linkAll () {
        for (const eventFile of this.eventFiles) {
            if (!eventFile.endsWith("Listener.js")) {
                console.log(`Evento desconhecido "${eventFile}" na pasta de eventos`);
                continue;
            }

            if (eventFile === "debugListener.js" && !this.nay.debugMode) continue;
            this.loadListener(eventFile);
            this.pullEvent(eventFile.slice(0, -11));
        }
    }

    loadListener (eventFile) {
        try {
            const Listener = require(`../events/${eventFile}`);
            if (!Listener || !(Listener?.prototype instanceof Event)) throw new Error(eventFile);

            return this.events.set(eventFile.slice(0, -11), Listener);
        } catch (err) {
            console.error(`\x1B[37m\x1B[41m[ ERROR ] - Não foi possivel carregar o evento "${eventFile}"\n${err}\x1B[49m\x1B[39m`);
        }
    }

    pullEvent (event) {
        try {
            const Listener = this.events.get(event);
            const listener = new Listener(this.nay);
            const listFunc = listener.on || listener.once;
            if (typeof listFunc !== "function") throw new Error("No valid listener");

            const receptor = listFunc.bind(listener);
            this.nay[listFunc.name](event, (...args) => receptor(...args));
        } catch (err) {
            console.error(`\x1B[37m\x1B[41m[ ERROR ] - Não foi possivel conectar o evento "${event}"\n${err}\x1B[49m\x1B[39m`);
        }
    }
};