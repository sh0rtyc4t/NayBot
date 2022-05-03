const Command = require("../../../structures/Command");

module.exports = class LanguageCommand extends Command {
    execute (interaction) {
        const selectedLang = interaction.getOptionValue("lang");
        if (interaction.subCmdName === "guild" && interaction.guildID) {
            const langEmbeds = {
                "pt-BR": this.nay.utils.makeEmbed(":flag_br: Agora neste servidor eu falo Português Brasileiro, hehe", "pt-BR"),
                "en-US": this.nay.utils.makeEmbed(":flag_us: Now in this server I speak English, eheh", "en-US")
            };
            langEmbeds["en-US"].footer.text = "(warning: Translations may not be 100% correct)";

            if (!interaction.member.permissions.has("manageGuild")) return;
            interaction.channel.guild.update({ locale: selectedLang });

            interaction.reply({ embed: langEmbeds[selectedLang] });

        } else {
            const langEmbeds = {
                "pt-BR": this.nay.utils.makeEmbed(":flag_br: Agora seu idioma é Português Brasileiro, hehe", "pt-BR"),
                "en-US": this.nay.utils.makeEmbed(":flag_us: Now your language is English, eheh", "en-US")
            };
            langEmbeds["en-US"].footer.text = "(warning: Translations may not be 100% correct)";

            interaction.author.doc.update({ locale: selectedLang });
            interaction.reply({ embed: langEmbeds[selectedLang] });
        }
    }

};