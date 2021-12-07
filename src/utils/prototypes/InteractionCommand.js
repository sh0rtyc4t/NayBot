const proto = ctx.Eris.CommandInteraction.prototype;

proto.createError = function (message) {
    const embed = {
        color: ctx.resolveColor("FF0000"),
        description: `${nay.emojis.error} | **${message}**`
    };

    this.createMessage({
        embeds: [embed],
        flags: 64
    });
};