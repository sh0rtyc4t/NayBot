const fs = require("fs");
module.exports = function () {
    const eventFiles = fs.readdirSync(`${ctx.mainDir}/src/core/events/`);

    for (const event of eventFiles) {
        const eventName = event.slice(0, -3);

        nay.on(eventName, (...params) => require(`${ctx.mainDir}/src/core/events/${event}`)(...params));
    }
};