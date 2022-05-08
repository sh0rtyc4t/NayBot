const firestore = require("firebase-admin/firestore");
let existentReferencesCache = [];
const get = firestore.DocumentReference.prototype.get;
const docDelete = firestore.DocumentReference.prototype.delete;

module.exports = {

    /**
     * @interface {firestore.DocumentReference.prototype.get}
     */
    "get": {
        async value (objPath) {
            let data = (await get.call(this)).data() ?? null;
            if (data !== null && objPath) data = objPath.split(".").reduce((object, property) => (object instanceof Object
                ? object[property]
                : null), data);
            return data;
        }
    },

    /**
     * @returns {Promise<Boolean>} - Whether the document exists.
     */
    "exists": {
        async value () {
            if (existentReferencesCache.includes(this.id)) return true;
            if ((await get.call(this)).exists) {
                existentReferencesCache.push(this.id);
                return true;
            }
            return false;
        }
    },

    /**
     * @interface {firestore.DocumentReference.prototype.delete}
     */
    "delete": {
        value () {
            existentReferencesCache = existentReferencesCache.filter(e => e !== this.id);
            docDelete.call(this);
        }
    },

    /**
     * @param {String} prop - The path to the object to get.
     * @param {Number} amount - The amount number to sum the property by.
     * @returns {Promise<FIrestore.DocumentSnapshot} - The snapshot of the document.
     */
    "add": {
        async value (prop, amount = 1) {
            let propVal = await this.get(prop);
            propVal ??= 0;
            propVal += amount;
            return this.update(Object.fromEntries([[prop, propVal]]));
        }
    },

    /**
     * @param {String} prop - The path to the object to get.
     * @param {Number} amount - The amount number to subtract the property by.
     * @returns {Promise<FIrestore.DocumentSnapshot} - The snapshot of the document.
     */
    "subtract": {
        async value (prop, amount = 1) {
            let propVal = await this.get(prop);
            propVal ??= 0;
            propVal -= amount;
            return this.update(Object.fromEntries([[prop, propVal]]));
        }
    }
};