const Eris = require("eris");

module.exports = {

    /**
     * @param {Object} options - The options for the message.
     * @param {Array} components - The components to add to the message.
     * @returns {Promise<Eris.Message>} - The message.
     */
    "reply": {
        value (options, components) {
            if (typeof options === "string" || typeof options === "number") options = {
                content: String(options)
            };
            options.messageReference = { messageID: this.id };
            options.allowedMentions = { repliedUser: options.mentionReply ?? true };
            return this._client.sendMessage(this.channel.id, options, components);
        }
    },

    /**
     * @param {Object} options - The options for the collector.
     * @param {Function} callback - The callback for the collector.
     * @param {Function} endCallback - The end callback for the collector.
     * @returns {Eris.Message} - This message.
     */
    "createComponentCollector": {
        value (options, callback, endCallback) {
            options ||= {};
            const listener = async interaction => {
                if (!(interaction instanceof Eris.ComponentInteraction) || this.id !== interaction.message.id) return;
                if (options.filter && !options.filter(interaction)) return;
                await interaction.deferUpdate();
                if (options.onlyAuthor && (this.interaction?.user.id || this.referencedMessage.interaction.user.id) !== interaction.author.id) return;
                return callback(interaction);
            };

            this._client.on("interactionCreate", listener);
            setTimeout(() => {
                this._client.removeListener("interactionCreate", listener);
                options.disableOnEnd && this.components.length && this.edit({
                    components: [
                        {
                            type: 1,
                            components: this.components[0].components?.map(c => ({
                                ...c,
                                disabled: true
                            }))
                        }
                    ]
                });
                endCallback && endCallback(this.components);
            }, options.time ?? 60000);
            return this;
        }
    },

    /**
     * @param {Object} options - The options for the message (all are optional).
     * @param {Array} components - The components to add to the message.
     * @returns {Promise<Eris.Message>} - The edited message.
     */
    "edify": {
        value (options, components) {
            return this._client.edifyMessage(this.channel.id, this.id, options, components);
        }
    }
};