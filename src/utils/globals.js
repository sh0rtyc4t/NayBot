global.isObject = function (obj) {
    return typeof obj === "object" && obj !== null;
};

global.resolvePath = function (...args) {
    return require("path").resolve(...args);
};

global.resolveColor = function (color) {
    return parseInt(color.replace("#", ""), 16);
};

global.makeDiscordDate = function (milliseconds, type) {
    const types = {
        "re": "R",
        "t": "t",
        "lt": "T",
        "d": "d",
        "ld": "D",
        "lld": "f",
        "llld": "F"
    };
    const date = Math.round(milliseconds / 10 / 10 / 10);

    return `<t:${date ?? 0}:${types[type] || "F"}>`;
};