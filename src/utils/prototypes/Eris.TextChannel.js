module.exports = {

    /**
     * @param {Object} options - The options to use.
     * @param {Function} callback - The callback to the collector.
     * @param {Function} endCallback - The callback to the collector when it ends.
     * @returns {Eris.Message} - The message that was sent.
     */
    "createMessageCollector": {
        value (options, callback, endCallback) {
            options ||= {};
            const listener = message => {
                if (message.channel.id !== this.id || message.author.bot) return;
                if (options.filter && !options.filter(message)) return;
                if (options.authorID && message.author.id !== options.authorID) return;
                return callback(message, end);
            };

            this._client.on("messageCreate", listener);
            setTimeout(end, options.time ?? 60000);
            function end (...args) {
                this._client.removeListener("messageCreate", listener);
                endCallback && endCallback(...args);
                return endCallback = null;
            }

            return {
                end
            };
        }
    }
};