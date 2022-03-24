const Eris = require("eris");
const Base = require("../structures/Base");
const firestore = require("firebase-admin/firestore");

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
                get () {
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

        // Eris Interaction

        Object.defineProperty(Eris.Interaction.prototype, "author", {
            get () {
                return this.user || this.member.user;
            }
        });

        // Eris CommandInteraction
        Object.defineProperties(Eris.CommandInteraction.prototype, {
            "subCmdName": {
                get () {
                    return this.data.options?.find(o => o.type === 1)?.name || null;
                }
            },
            "reply": {
                value (options, components) {
                    return nay.sendMessage(this, options, components);
                }
            },
            "createError": {
                value (error) {
                    const embed = {
                        color: global.resolveColor(self.config.baseColor),
                        description: `${nay.emojis.error} ┃ **${error}**`
                    };

                    return this.createMessage({
                        embeds: [embed],
                        flags: 64
                    });
                }
            },
            "getOptionUser": {
                value () {
                    const options = this.data.options?.[0].type === 1 ? this.data.options[0].options : this.data.options;
                    const user = options?.find(o => o.name === "user" || o.type === 6)?.value;
                    return user ? nay.getRESTUser(user) : null;
                }
            },
            "getAllOptionUsers": {
                value (fetch) {
                    const options = this.data.options?.[0].type === 1 ? this.data.options[0].options : this.data.options;
                    const users = options?.filter(o => o.type === 6);
                    return fetch ? users.map(async u => await nay.getRESTUser(u.value)) : users;
                }
            },
            "getOptionValue": {
                value (name) {
                    const options = this.data.options?.[0].type === 1 ? this.data.options[0].options : this.data.options;
                    return options?.find(o => o.name === name).value ?? null;
                }
            }
        });

        // Eris User
        Object.defineProperties(Eris.User.prototype, {
            "tag": {
                get () {
                    return `${this.username}#${this.discriminator}`;
                }
            },
            "doc": {
                get () {
                    return self.db.users.doc(this.id);
                }
            }
        });

        // Eris Guild
        Object.defineProperties(Eris.Guild.prototype, {
            "doc": {
                get () {
                    return self.db.guilds.doc(this.id);
                }
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
                        if (options.onlyAuthor && this.interaction.user.id !== interaction.author.id) return;
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

        Object.defineProperties(firestore.CollectionReference.prototype, {
            "getAll": {
                async value () {
                    const snapshotQuery = await this.get();
                    return snapshotQuery.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                }
            }
        });

        let existentReferencesCache = [];
        const get = firestore.DocumentReference.prototype.get;
        const docDelete = firestore.DocumentReference.prototype.delete;

        // Firestore DocumentReference
        Object.defineProperties(firestore.DocumentReference.prototype, {
            "get": {
                async value (objPath) {
                    let data = (await get.call(this)).data() ?? null;
                    if (data !== null && objPath) data = objPath.split(".").reduce((object, property) => (object instanceof Object
                        ? object[property]
                        : null), data);
                    return data;
                }
            },

            "exists": {
                async value () {
                    if (existentReferencesCache.includes(this.id)) return true;
                    if ((await get.call(this)).exists) {
                        existentReferencesCache.push(this.id);
                        return true;
                    }
                    return false;
                }
            },

            "delete": {
                value () {
                    existentReferencesCache = existentReferencesCache.filter(e => e !== this.id);
                    docDelete.call(this);
                }
            },

            "add": {
                async value (prop, amount = 1) {
                    let propVal = await this.get(prop);
                    propVal ??= 0;
                    propVal += amount;
                    return this.update(Object.fromEntries([[prop, propVal]]));
                }
            },

            "subtract": {
                async value (prop, amount = 1) {
                    let propVal = await this.get(prop);
                    propVal ??= 0;
                    propVal -= amount;
                    return this.update(Object.fromEntries([[prop, propVal]]));
                }
            }

        });
    }
};