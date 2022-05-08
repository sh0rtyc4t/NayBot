const config = require("../../structures/Configurations.js");

module.exports = {

    /**
     * @returns {String} - The subcommand name if exists.
     */
    "subCmdName": {
        get () {
            return this.data.options?.find(o => o.type === 1)?.name || null;
        }
    },

    /**
     * @param {Object} options - The options of the message.
     * @param {Array} components - The components of the message.
     * @returns {Promise<Eris.Message>} - The message.
     */
    "reply": {
        value (options, components) {
            return this._client.sendMessage(this, options, components);
        }
    },

    /**
     * Creates a preseted error message.
     * @param {String} error - The error message.
     * @returns {Promise<Eris.Message>} - The message.
     */
    "createError": {
        value (error) {
            const embed = {
                color: this._client.utils.resolveColor(config.baseColor),
                description: `${this._client.emojis.error} ┃ **${error}**`
            };

            return this.createMessage({
                embeds: [embed],
                flags: 64
            });
        }
    },

    /**
     * @returns {Eris.User} - The value of first opttion user.
     */
    "getOptionUser": {
        value () {
            const options = this.data.options?.[0].type === 1 ? this.data.options[0].options : this.data.options;
            const user = options?.find(o => o.name === "user" || o.type === 6)?.value;
            return user ? this._client.getRESTUser(user) : null;
        }
    },

    /**
     * @param {Boolean} fetch - Whether users will be fetched in the api.
     * @returns {Array<Eris.User>} - All mentioned users.
     */
    "getAllOptionUsers": {
        value (fetch) {
            const options = this.data.options?.[0].type === 1 ? this.data.options[0].options : this.data.options;
            const users = options?.filter(o => o.type === 6);
            return fetch ? users.map(async u => await this._client.getRESTUser(u.value)) : users;
        }
    },

    /**
     * @param {String} name - The name of the option.
     * @returns {Eris.User} - The value of the option.
     */
    "getOptionValue": {
        value (name) {
            const options = this.data.options?.[0].type === 1 ? this.data.options[0].options : this.data.options;
            return options?.find(o => o.name === name).value ?? null;
        }
    }
};