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
        return this;
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

    set (reference, value) {
        const ref = this.getRef(reference);
        return firebase.set(ref, value);
    }

    remove (reference) {
        const ref = this.getRef(reference);
        return firebase.remove(ref);
    }

    exists (reference) {
        const ref = this.getRef(reference);
        return new Promise((res, rej) => {
            firebase.onValue(ref, snapshot => res(snapshot.exists()), rej);
        });
    }
};