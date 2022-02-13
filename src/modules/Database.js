const app = require("firebase-admin/app");
const firestore = require("firebase-admin/firestore");

module.exports = function (credentials) {
    if (!credentials) throw new Error("App launched without credentials");
    app.initializeApp({
        credential: app.cert(credentials)
    });
    return firestore.getFirestore();
};