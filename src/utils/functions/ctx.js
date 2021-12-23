/**
 * Converts hexadecimal color for number
 * @param {String} color Hexadecimal color
 * @returns {Number} Color in number
 */
ctx.resolveColor = function (color) {
    return parseInt(color.replace("#", ""), 16);
};

/**
 * Generate a base embed for commands
 * @param {String} description Description of embed
 * @param {String} title Optional embed title
 * @returns EmbedObject
 */
ctx.BaseEmbed = function (description, title) {
    this.title = title;
    this.color = ctx.resolveColor("FF0000");
    this.description = description;
    this.timestamp = new Date();
    this.footer = {
        // eslint-disable-next-line camelcase
        icon_url: nay.user.avatarURL,
        text: nay.user.tag
    };

    return this;
};