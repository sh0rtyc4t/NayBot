module.exports = function (err) {
    const embed = {
        timestamp: new Date(),
        title: err.name || "Error",
        color: ctx.resolveColor("#FF0000"),
        description: (err.message || err).encode("js"),
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