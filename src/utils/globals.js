global.isObject = function (obj) {
    return typeof obj === "object" && obj !== null;
};

global.resolvePath = function (...args) {
    return require("path").resolve(...args);
};