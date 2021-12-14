module.exports = class NayUser {
    constructor (id) {
        this._id = id;
    }

    static check (id) {
        return db.exists(`users/${id}`);
    }

    register () {
        const obj = {
            commands: 1,
            potatos: 0,
            itens: []
        };

        db.set(`users/${this._id}`, obj);
    }

};