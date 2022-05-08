module.exports = {

    /**
     * @returns {Firestore.CollectionReference} - The users collection.
     */
    "users": {
        get () {
            return this.collection("users");
        }
    },

    /**
     * @returns {Firestore.CollectionReference} - The guilds collection.
     */
    "guilds": {
        get () {
            return this.collection("guilds");
        }
    },

    /**
     * @returns {Firestore.CollectionReference} - The admin collection.
     */
    "admin": {
        get () {
            return this.collection("admin");
        }
    }
};