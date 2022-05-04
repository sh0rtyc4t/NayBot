const Base = require("../structures/Base");

module.exports = class NayUtils extends Base {
    makeEmbed (description, title, thumbnail) {
        return {
            title,
            color: this.resolveColor(this.config.baseColor),
            description,
            timestamp: new Date(),
            thumbnail: { url: thumbnail },
            footer: {
                icon_url: this.nay.user.dynamicAvatarURL("png", 512),
                text: this.nay.user.tag
            }
        };
    }

    makeDiscordDate (milliseconds, type) {
        const types = {
            "re": "R",
            "t": "t",
            "lt": "T",
            "d": "d",
            "ld": "D",
            "lld": "f",
            "llld": "F"
        };
        const date = Math.round(milliseconds / 10 / 10 / 10);
        return `<t:${date ?? 0}:${types[type] || "F"}>`;
    }

    resolveColor (color) {
        if (typeof color === "string") {
            if (color.startsWith("#")) return parseInt(color.replace("#", "0x"), 16);
            else if (color.startsWith("0x")) return parseInt(color, 16);
            else if (color.startsWith("0b")) return parseInt(color, 2);
            else if (color.startsWith("0o")) return parseInt(color, 8);
            else if (color.startsWith("0")) return parseInt(color, 10);
            return color;
        }
        return color;
    }

    yesNoPoll (message, filter, content = {}) {
        return new Promise(resolve => {
            message.edify(content, [
                {
                    type: "but",
                    style: "green",
                    name: "yes",
                    emoji: {
                        name: "nayOk",
                        id: "917754100798590986"
                    }
                },
                {
                    type: "but",
                    style: "red",
                    name: "no",
                    emoji: {
                        name: "nayError",
                        id: "917761409566244894"
                    }
                }
            ]).then(() => {
                message.createComponentCollector({
                    filter,
                    onlyAuthor: !filter,
                    disableOnEnd: true
                }, button => {
                    if (button.data.custom_id === "yes") resolve(true);
                    else resolve(false);
                }, () => resolve(false));
            });
        });
    }
};