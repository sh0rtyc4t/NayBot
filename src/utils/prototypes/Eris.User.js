const db = require("../../modules/Database.js").db;

module.exports = {

    /**
     * @returns {String} - The tag of the user.
     */
    "tag": {
        get () {
            return `${this.username}#${this.discriminator}`;
        }
    },

    /**
     * @returns {Firestore.DocumentReference} - The document of the user.
     */
    "doc": {
        get () {
            return db.users.doc(this.id);
        }
    }
};