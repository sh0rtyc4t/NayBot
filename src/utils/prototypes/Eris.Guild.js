const db = require("../../modules/Database.js").db;

module.exports = {

    /**
     * @returns {Firestore.DocumentReference} - The document reference for the guild.
     */
    "doc": {
        get () {
            return db.guilds.doc(this.id);
        }
    }
};