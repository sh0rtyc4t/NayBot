const Eris = require("eris");

/**
 * Returns a error embed for the user
 * @param {String} message Error message
 * @returns {Promise<void>}
 */
Eris.CommandInteraction.prototype.createError = function (message) {
    const embed = {
        color: ctx.resolveColor("FF0000"),
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