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
};