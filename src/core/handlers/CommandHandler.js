const commands = require("../../../config/commands.json");
const Base = require("../../structures/Base.js");
const Command = require("../../structures/Command.js");

module.exports = class CommandHandler extends Base {
    constructor (nay) {
        super();
        this.nay = nay;
        this.devGuilds = this.config.devGuilds;
        this.commands = new this.modules.Eris.Collection("commands");
    }

    async _wasRegistred (commandName, guildID) {
        const command = await this.getCommandByName(commandName, guildID);
        return Boolean(command);
    }

    async _wasModified (commandName, guildID) {
        const command = await this.getCommandByName(commandName, guildID);
        const commandObj = commands.find(c => c.name === commandName);
        if (!commandObj) return true;

        return JSON.stringify({
            description: commandObj.description,
            default_permission: !commandObj.acess.forDevs,
            options: commandObj.options
        }) !== JSON.stringify({
            description: command.description,
            default_permission: command.default_permission || false,
            options: command.options
        });
    }

    async getCommandByName (name, guildID) {
        if (!isNaN(name)) return guildID
            ? this.nay.getCommand(name)
            : this.nay.getGuildCommand(name, guildID);
        const cmds = guildID
            ? await this.nay.getGuildCommands(guildID)
            : await this.nay.getCommands();

        return cmds.find(c => c.name === name) || null;
    }

    async postCommand (data) {
        if (!data?.name || !data?.description) return;
        if (await this._wasRegistred(data.name)) {
            if (await this._wasModified(data.name)) {
                const id = (await this.getCommandByName(data.name)).id;
                return this.nay.editCommand(id, data);
            }
            return data;
        }
        return this.nay.createCommand(data);
    }

    async postDevCommand (data) {
        if (!data?.name || !data?.description) return;
        data.default_permission = false;

        for (const devGuild of this.devGuilds) {
            if (await this._wasRegistred(data.name, devGuild)) {
                if (await this._wasModified(data.name, devGuild)) {
                    const id = (await this.getCommandByName(data.name, devGuild)).id;
                    this.nay.editGuildCommand(devGuild, id, data);
                    continue;
                }
                continue;
            }
            const command = await this.nay.createGuildCommand(devGuild, data);
            this.nay.editCommandPermissions(devGuild, command.id, this.config.owners.map(id => ({
                id,
                type: 2,
                permission: true
            })));
        }

        return data;
    }

    async deleteCommand (commandName, guildID) {
        const id = (await this.getCommandByName(commandName, guildID)).id;
        return guildID
            ? this.nay.deleteGuildCommand(guildID, id)
            : this.nay.deleteCommand(id);
    }

    async deleteAll ({ guildCommands, globalCommands }) {
        if (guildCommands) for (const devGuild of this.devGuilds) {
            for (const { id } of await this.nay.getGuildCommands(devGuild)) await this.deleteCommand(id, devGuild);
        }

        if (globalCommands) for (const { id } of await this.nay.getCommands()) await this.deleteCommand(id);
        return this;
    }

    deployAll () {
        for (const { name, description, acess, options, DM, dir } of commands) {
            const data = {
                name,
                description,
                options,
                dm_permission: DM
            };

            acess.forDevs
                ? this.postDevCommand(data)
                : this.postCommand(data);

            let CmdFile = null;

            try {
                CmdFile = require(`../commands/${dir}.js`);
                if (!CmdFile || !(CmdFile?.prototype instanceof Command)) throw new Error(`${CmdFile} is not a Command extension`);
            } catch (e) {
                this.nay.emit("error", `Não foi possivel carregar o comando "${name}"\n${e}`);
                CmdFile = Command;
            }

            this.commands.set(name, new CmdFile(this.nay));
        }
        return this.size;
    }

    toJSON () {
        return commands;
    }
};