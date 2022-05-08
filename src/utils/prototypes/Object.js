module.exports = {

    /**
     * @returns {Number} - Amount of properties in the object.
     */
    "amount": {
        value () {
            return Object.keys(this).length;
        }
    },

    /**
     * @returns {Boolean} - True if the object is empty.
     * @returns {Boolean} - False if the object is not empty.
     */
    "isEmpty": {
        get () {
            return Boolean(this.amount <= 0);
        }
    },

    /**
     * @function - A map function that returns a new object with the results of calling a provided function on every element in this object.
     * @param {Function} callback - Function that produces an element of the new object.
     * @param {Object} [thisArg] - Value to use as this when executing callback.
     * @returns {Object} - A new object with the results of calling a provided function on every element in this object.
     */
    "maping": {
        value (mapFunc) {
            return Object.fromEntries(
                Object.entries(this).map(([k, v], i) => [k, mapFunc(v, k, i)])
            );
        }
    }
};