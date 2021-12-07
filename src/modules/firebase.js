const app = require("firebase/app");
const firebase = require("firebase/database");

module.exports = class Database {

    constructor (firebaseConfig) {
        this.firebase = firebase;
        this.app = app;
        this.firebaseConfig = firebaseConfig;
    }

    connect () {
        const fbApp = app.initializeApp(this.firebaseConfig);
        this.db = firebase.getDatabase(fbApp);
    }

    getRef (reference) {
        return firebase.ref(this.db, reference);
    }

    getVal (reference) {
        const ref = this.getRef(reference);
        return new Promise((res, rej) => {
            firebase.onValue(ref, snapshot => res(snapshot.val()), rej);
        });
    }

    set (reference, valueObj) {
        const ref = this.getRef(reference);
        return firebase.set(ref, valueObj);
    }

    remove (reference) {
        const ref = this.getRef(reference);
        return firebase.remove(ref);
    }
};