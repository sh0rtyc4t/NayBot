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