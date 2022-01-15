const path = require("path");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./tmp/config.json.tmp"));
fs.rmSync("./tmp/config.json.tmp");
global.MP = true;
let botIsLoaded = false;

if (config.isDev) process.argv.push("--dev");

const startBut = document.getElementById("startButton");

startBut.addEventListener("click", async () => {
    if (startBut.innerText === "Start Bot") {
        startBut.innerText = "Starting...";
        return botIsLoaded
            ? nay.connect()
            : require(path.resolve(".", "index.js"));
    }
    if (startBut.innerText === "Stop Bot") {
        startBut.innerText = "Stopping...";
        await nay.disconnect();
        botIsLoaded = true;
        startBut.innerText = "Start Bot";
        return startBut;
    }
});