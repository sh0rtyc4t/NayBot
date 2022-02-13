const Eris = require("eris");
const Base = require("../structures/Base");
const firestore = require("firebase-admin/firestore");
// [ jerry-rig ] -  for some reason loading this dependency after the prototypes causes an error in the code

module.exports = class Prototypes extends Base {
    constructor (nay) {
        super();
        const self = this;

        // Objects
        Object.defineProperties(Object.prototype, {
            "amount": {
                value () {
                    return Object.keys(this).length;
                }
            },
            "isEmpty": {
                value () {
                    return Boolean(this.amount <= 0);
                }
            }
        });

        // Arrays
        Object.defineProperties(Array.prototype, {
            "isEmpty": {
                get () {
                    return Boolean(this.length <= 0);
                }
            }
        });

        // Strings
        Object.defineProperties(String.prototype, {
            "encode": {
                value (lang) {
                    return `\`\`\`${lang}\n${this}\n\`\`\``;
                }
            }
        });

        // Eris CommandInteraction
        Object.defineProperties(Eris.CommandInteraction.prototype, {
            "reply": {
                value (options, components) {
                    return nay.sendMessage(this, options, components);
                }
            },
            "createError": {
                value (message) {
                    const embed = {
                        color: self.resolveColor(self.config.baseColor),
                        description: `${nay.emojis.error} ┃ **${message}**`
                    };

                    return this.createMessage({
                        embeds: [embed],
                        flags: 64
                    });
                }
            }
        });

        // Eris User
        Object.defineProperty(Eris.User.prototype, "tag", {
            get () {
                return `${this.username}#${this.discriminator}`;
            }
        });

        // Eris Message
        Object.defineProperties(Eris.Message.prototype, {
            "reply": {
                value (options, components) {
                    if (typeof options === "string" || typeof options === "number") options = {
                        content: String(options)
                    };
                    options.messageReference = { messageID: this.id };
                    options.allowedMentions = { repliedUser: options.mentionReply ?? true };
                    return nay.sendMessage(this.channel.id, options, components);
                }
            },

            "createComponentCollector": {
                value (options, callback, endCallback) {
                    options ||= {};
                    const listener = async interaction => {
                        if (!(interaction instanceof Eris.ComponentInteraction) || this.id !== interaction.message.id) return;
                        if (options.filter && !options.filter(interaction)) return;
                        if (options.onlyAuthor && this.interaction.user.id !== interaction.member.id) return;
                        await interaction.deferUpdate();
                        return callback(interaction);
                    };

                    nay.on("interactionCreate", listener);
                    setTimeout(() => {
                        nay.removeListener("interactionCreate", listener);
                        options.disableOnEnd && this.edit({
                            components: [
                                {
                                    type: 1,
                                    components: this.components[0].components.map(c => ({
                                        ...c,
                                        disabled: true
                                    }))
                                }
                            ]
                        });
                        endCallback && endCallback(this.components);
                    }, options.time ?? 60000);
                    return this;
                }
            }
        });

        // Firestore
        Object.defineProperties(firestore.Firestore.prototype, {
            "users": {
                get () {
                    return this.collection("users");
                }
            },

            "guilds": {
                get () {
                    return this.collection("guilds");
                }
            },

            "nay": {
                get () {
                    return this.collection("nay");
                }
            }

        });

        const get = firestore.DocumentReference.prototype.get;
        // Firestore DocumentReference
        Object.defineProperties(firestore.DocumentReference.prototype, {
            "get": {
                async value () {
                    return (await get.call(this)).data() ?? null;
                }
            },

            "exists": {
                async value () {
                    return (await get.call(this)).exists;
                }
            }

        });
    }
};