const app = require("firebase-admin/app");
const firestore = require("firebase-admin/firestore");
const config = require("../structures/Configurations.js");

class Database {
    constructor (credentials) {
        if (!credentials) throw new Error("Firebase launched without credentials");
        this.credentials = credentials;
    }

    init () {
        if (!this.app) this.app = app.initializeApp({
            credential: app.cert(this.credentials)
        });
        this.db = firestore.getFirestore();
        return this.db;
    }
}

module.exports = new Database(config.firebase);