module.exports = function (warn) {
    const embed = {
        timestamp: new Date(),
        title: warn.name || "Warn",
        color: ctx.resolveColor("#fce35a"),
        description: (warn.message || warn).encode("js"),
        fields: [
            {
                name: "Local",
                value: "bah"
            },
            {
                name: "Usuário",
                value: "tchẽ"
            }
        ]
    };

    ctx.hooks.errorLog({ embeds: [embed] });
};