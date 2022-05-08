module.exports = {

    /**
     * @param {String} [lang] - Language of the code block.
     * @returns {String} - Returns the string inside of a code block.
     */
    "encode": {
        value (lang = "") {
            return `\`\`\`${lang}\n${this}\n\`\`\``;
        }
    }
};