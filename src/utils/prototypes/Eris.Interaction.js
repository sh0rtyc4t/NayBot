module.exports = {

    /**
     * @returns {Eris.User} - Returns the author of the interaction.
     */
    "author": {
        get () {
            return this.user || this.member.user;
        }
    }
};