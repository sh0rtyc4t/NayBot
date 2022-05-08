module.exports = {

    /**
     * @returns {Boolean} - True if the array is empty.
     * @returns {Boolean} - False if the array is not empty.
     */
    "isEmpty": {
        get () {
            return Boolean(this.length <= 0);
        }
    },

    /**
     * Returns a random element from the array.
     * @returns {Object} - A random element from the array.
     * @returns {undefined} - If the array is empty.
     */
    "random": {
        value () {
            return this[Math.floor(Math.random() * this.length)];
        }
    }
};