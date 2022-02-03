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
    this.color = ctx.resolveColor(ctx.config.baseColor);
    this.description = description;
    this.timestamp = new Date();
    this.footer = {
        icon_url: nay.user.dynamicAvatarURL("png", 512),
        text: nay.user.tag
    };

    return this;
};