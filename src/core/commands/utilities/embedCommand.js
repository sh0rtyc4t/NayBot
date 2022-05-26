const Command = require("../../../structures/Command");

module.exports = class EmbedCommand extends Command {
    constructor (nay) {
        super(nay);
        this.questions = null;
        this.embedComponents = ["title", "description", "color", "thumbnail", "image", "footer", "author", "fields", "timestamp"];
        this.mountedEmbed = {
            footer: {},
            author: {},
            fields: [],
            image: {},
            thumbnail: {}
        };
    }

    async execute (interaction, t) {
        const T = t("commands:embed", { returnObjects: true });
        this.questions = T.questions.maping(v => ({
            description: v.description,
            image: { url: v.image }
        }));
        const embed = this.nay.utils.makeEmbed(T.embed1.description, T.embed1.title);
        const message = await interaction.reply({ embed }, [
            {
                type: "but",
                label: "JSON",
                style: "gray",
                name: "json"
            },
            {
                type: "but",
                label: T.but2.label,
                style: "gray",
                name: "msg"
            }
        ]);

        message.createComponentCollector({
            onlyAuthor: true,
            disableOnEnd: true
        }, async button => {
            message.edit({
                components: [
                    {
                        type: 1,
                        components: message.components[0].components.map(c => ({
                            ...c,
                            disabled: true
                        }))
                    }
                ]
            });

            if (button.data.custom_id === "json") {
                interaction.reply(T.messages.sendJson);
                message.channel.createMessageCollector({ authorID: interaction.author.id }, (m, end) => {
                    let userEmbed = null;
                    try {
                        userEmbed = JSON.parse(m.content);
                    } catch {
                        return interaction.createError(t("errors:noValidJson"));
                    }
                    userEmbed.color = this.nay.utils.resolveColor(userEmbed.color);
                    interaction.channel.createMessage({ embed: userEmbed });
                    end();
                }, () => interaction.createError(t("errors:timeOver")));

            } else {
                const questions = this.embedQuestions();
                const msg = await interaction.reply({
                    embed: {
                        ...questions.next().value,
                        title: "title",
                        color: this.nay.utils.resolveColor("#FF0000")
                    }
                }, [
                    {
                        type: "but",
                        label: "Cancel",
                        style: "red",
                        name: "cancel"
                    }
                ]);

                const collector = message.channel.createMessageCollector({
                    filter: i => i.author.id === interaction.author.id,
                    time: 60000 * 3
                }, async (m, end) => {
                    if (m.content.toLowerCase() === "cancel" || m.content.toLowerCase() === "cancelar") return end("cancel");
                    m.delete();
                    this.defineComponent(m.content);
                    const comp = this.embedComponents[0];

                    if (comp === "timestamp") {
                        const result = await this.nay.utils.yesNoPoll(msg, i => i.author.id === interaction.author.id, {
                            embed: {
                                ...this.questions.timestamp,
                                title: "timestamp",
                                color: this.nay.utils.resolveColor("#FF0000")
                            }
                        });
                        result && this.defineComponent(new Date());
                    }

                    if (!this.embedComponents.length) return end("end");

                    return msg.edify({
                        embed: {
                            ...questions.next().value,
                            title: comp,
                            color: this.nay.utils.resolveColor("#FF0000")
                        }
                    });
                }, reason => {
                    if (reason === "cancel") {
                        return interaction.createError(t("errors:cancel"));
                    } else if (reason === "end") {
                        return interaction.channel.createMessage({ embed: this.mountedEmbed });
                    }
                    return interaction.createError(t("errors:timeOver"));
                });

                msg.createComponentCollector({
                    filter: i => i.author.id === interaction.author.id && i.data.custom_id === "cancel",
                    time: 60000 * 3
                }, () => {
                    collector.end("cancel");
                    return interaction.createError(t("errors:cancel"));
                });
            }
        });
    }

    * embedQuestions () {
        yield this.questions.title;
        yield this.questions.description;
        yield this.questions.color;
        yield this.questions.thumbnail;
        yield this.questions.image;
        yield this.questions.footer;
        yield this.questions.author;
        yield this.questions.fields;
        yield this.questions.timestamp;
    }

    defineComponent (content) {
        const comp = this.embedComponents[0];
        switch (comp) {
            case "footer": {
                const [text, icon] = content.split("|");
                this.mountedEmbed.footer.text = text;
                this.mountedEmbed.footer.icon = icon;
            }
                break;

            case "author": {
                const [text, icon] = content.split("|");
                this.mountedEmbed.author.text = text;
                this.mountedEmbed.author.icon = icon;
            }
                break;

            case "fields": {
                const fields = content.split(";");
                for (const field of fields) {
                    const [name, value] = field.split("|");
                    this.mountedEmbed.fields.push({
                        name,
                        value
                    });
                }
            }
                break;

            case "color":
                this.nay.utils.resolveColor(content);
                break;

            case "image":
                this.mountedEmbed.image.url = content;
                break;
            case "thumbnail":
                this.mountedEmbed.thumbnail.url = content;
                break;

            default:
                this.mountedEmbed[comp] = content;
                break;
        }

        this.embedComponents = this.embedComponents.slice(1);
    }
};