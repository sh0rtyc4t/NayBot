module.exports = function () {
    nay.loadCore();
    if (global.CLI) {
        document.getElementById("startButton").innerText = "Stop Bot";
    }
};