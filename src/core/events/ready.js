module.exports = function () {
    nay.loadCore();
    if (global.MP) {
        document.getElementById("startButton").innerText = "Stop Bot";
    }
};