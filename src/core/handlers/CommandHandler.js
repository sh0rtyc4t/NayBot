const commands = require("../../../config/commands.json");
const Base = require("../../structures/Base.js");
const Command = require("../../structures/Command.js");

module.exports = class CommandHandler extends Base {
    constructor (nay) {
        super();
        this.nay = nay;
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
        if (!isNaN(name)) return guildID ? this.nay.getCommand(name) : this.nay.getGuildCommand(name, guildID);
        const cmds = guildID ? await this.nay.getGuildCommands(guildID) : await this.nay.getCommands();
        return cmds.find(c => c.name === name) || null;
    }

    async createCommand (data, guildID) {
        if (!data?.name || !data?.description) return;

        if (await this._wasRegistred(data.name, guildID)) {
            if (await this._wasModified(data.name, guildID)) {
                await this.editCommand(data.name, data, guildID);
                return this.nay.log.info(null, "commandcontroller", {
                    actionType: "update",
                    name: data.name,
                    isDev: Boolean(guildID)
                });
            }
            return false;
        }

        if (guildID) {
            data.default_permission = false;
            const command = await this.nay.createGuildCommand(guildID, data);
            await this.nay.editCommandPermissions(guildID, command.id, this.config.owners.map(id => ({
                id,
                type: 2,
                permission: true
            })));
        } else {
            this.nay.createCommand(data);
        }

        return this.nay.log.info(null, "commandcontroller", {
            actionType: "create",
            name: data.name,
            isDev: Boolean(guildID)
        });
    }

    async editCommand (commandName, data, guildID) {
        const id = (await this.getCommandByName(commandName)).id;
        await guildID ? this.nay.editGuildCommand(guildID, id, data) : this.nay.editCommand(id, data);
        return this.nay.log.info(null, "commandcontroller", {
            actionType: "update",
            name: commandName,
            isDev: Boolean(guildID)
        });
    }

    async deleteCommand (commandName, guildID) {
        const id = (await this.getCommandByName(commandName, guildID)).id;
        await guildID ? this.nay.deleteGuildCommand(guildID, id) : this.nay.deleteCommand(id);
        return this.nay.log.info(null, "commandcontroller", {
            actionType: "delete",
            name: commandName,
            isDev: Boolean(guildID)
        });
    }

    async deleteAll ({ guildCommands, globalCommands }) {
        if (guildCommands) for (const devGuild of this.config.devGuilds) {
            for (const { id } of await this.nay.getGuildCommands(devGuild)) await this.deleteCommand(id, devGuild);
        }

        if (globalCommands) for (const { id } of await this.nay.getCommands()) await this.deleteCommand(id);
        return this;
    }

    deployAll () {
        for (const { name, description, acess, options, DM, dir } of commands) {
            let CmdFile = null;
            const data = {
                name,
                description,
                options,
                dm_permission: DM
            };

            if (acess.forDevs) {
                for (const devGuild of this.config.devGuilds) this.createCommand(data, devGuild);
            } else this.createCommand(data);

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