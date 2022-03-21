const Command = require("../../../structures/Command");

module.exports = class LanguageCommand extends Command {
    constructor (nay) {
        super(nay);
    }

    execute (interaction, t, { guildDoc, authorDoc }) {
        const subCmd = interaction.data.options[0].name;
        const selectedLang = interaction.data.options[0].options[0].value;

        if (subCmd === "guild") {
            const langEmbeds = {
                "pt-BR": this.makeBaseEmbed(":flag_br: Agora neste servidor eu falo Português Brasileiro, hehe", "pt-BR"),
                "en-US": this.makeBaseEmbed(":flag_us: Now in this server I speak English, eheh", "en-US")
            };
            langEmbeds["en-US"].footer.text = "(warning: Translations may not be 100% correct)";

            if (!interaction.member.permissions.has("manageGuild")) return;
            guildDoc.update({ locale: selectedLang });

            interaction.reply({ embed: langEmbeds[selectedLang] });

        } else {
            const langEmbeds = {
                "pt-BR": this.makeBaseEmbed(":flag_br: Agora seu idioma é Português Brasileiro, hehe", "pt-BR"),
                "en-US": this.makeBaseEmbed(":flag_us: Now your language is English, eheh", "en-US")
            };
            langEmbeds["en-US"].footer.text = "(warning: Translations may not be 100% correct)";

            authorDoc.update({ locale: selectedLang });
            interaction.reply({ embed: langEmbeds[selectedLang] });
        }
    }

};