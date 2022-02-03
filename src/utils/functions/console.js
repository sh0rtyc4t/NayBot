const logErr = console.error;
const logWarn = console.warn;
const logDebug = console.debug;
console.error = (...messages) => logErr(`\x1B[37m\x1B[41m[ ERROR ] - ${messages}\x1B[49m\x1B[39m`);
console.warn = (...messages) => logWarn(`\x1B[30m\x1B[43m[ WARNING ] - ${messages}\x1B[49m\x1B[39m`);
console.debug = (...messages) => logDebug(`\x1B[37m\x1B[45m[ DEBUG ] - ${messages}\x1B[49m\x1B[39m`);