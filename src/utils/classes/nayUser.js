module.exports = class NayUser {
    constructor (id) {
        this._id = id;
        this.base = ctx.config.userSchema;
    }

    static check (id) {
        return db.exists(`users/${id}`);
    }

    register () {
        db.set(`users/${this._id}`, this.base);
    }

};