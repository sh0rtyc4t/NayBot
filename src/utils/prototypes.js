const Eris = require("eris");

/**
 * Returns a error embed for the user
 * @param {String} message Error message
 * @returns {Promise<void>}
 */
Eris.CommandInteraction.prototype.createError = function (message) {
    const embed = {
        color: ctx.resolveColor(ctx.config.baseColor),
        description: `${nay.emojis.error} ┃ **${message}**`
    };

    return this.createMessage({
        embeds: [embed],
        flags: 64
    });
};

Object.defineProperty(Eris.User.prototype, "tag", {
    get () {
        return `${this.username}#${this.discriminator}`;
    }
});

/**
 * Transforms the string into a Markdown code
 * @param {String} lang
 * @returns {String}
 */
String.prototype.encode = function (lang) {
    return `\`\`\`${lang}\n${this}\n\`\`\``;
};

/**
 * Creates a select menu or button collector
 * @param {Object} options collector options
 * @param {Function} callback
 * @param {Function} endCallback
 * @callback callback returns the user interaction
 * @callback the end of the collector
 */
Eris.Message.prototype.createComponentCollector = function (options, callback, endCallback) {
    const listener = interaction => {
        if (!(interaction instanceof Eris.ComponentInteraction) || this.id !== interaction.message.id) return;
        if (options.filter && !options.filter(interaction)) return;
        return callback(interaction);
    };

    nay.on("interactionCreate", listener);
    setTimeout(() => {
        nay.removeListener("interactionCreate", listener);
        endCallback && endCallback(this.components);
    }, options.time ?? 60000);
    return this;
};

Eris.CommandInteraction.prototype.reply = function (options, components) {
    return nay.sendMessage(this, options, components);
};

Eris.Message.prototype.reply = function (options, components) {
    if (typeof options === "string" || typeof options === "number") options = {
        content: String(options)
    };
    options.messageReference = { messageID: this.id };
    options.allowedMentions = { repliedUser: options.mentionReply ?? true };
    return nay.sendMessage(this.channel.id, options, components);
};