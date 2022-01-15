(async () => {
    const { app, BrowserWindow } = require("electron");
    const fs = require("fs");
    fs.writeFileSync("./tmp/config.json.tmp", `{"isDev": ${process.argv.includes("--dev")}}`);

    await app.whenReady();
    const win = new BrowserWindow({
        width: 1024,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile("./index.html");
})();