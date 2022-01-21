module.exports = async function () {
    const cmds = nay.commands;

    for (const cmd of cmds) {
        const cmdPath = `${ctx.mainDir}/src/core/commands/${cmd.dir}.js`;
        cmd.execute = require(cmdPath);
        const cmdData = {
            name: cmd.name,
            description: cmd.description,
            dm_permission: cmd.DM,
            options: cmd.options
        };
        cmd.acess.forDevs
            ? putDevCommand({
                name: cmd.name,
                description: cmd.description,
                options: cmd.options
            })
            : await hasRegistred(cmd.name)
                ? await wasModified(cmdData)
                    ? nay.editCommand((await nay.getCommands()).find(c => c.name === cmd.name).id, cmdData)
                    : null
                : nay.createCommand(cmdData);
    }
    return cmds;
};

async function putDevCommand (data) {
    const guilds = ctx.config.devGuilds;

    for (const devGuild of guilds) {
        if (await hasRegistred(data.name, devGuild)) continue;
        data.default_permission = false;
        const command = await nay.createGuildCommand(devGuild, data);

        nay.editCommandPermissions(devGuild, command.id, ctx.config.owners.map(id => ({
            id,
            type: 2,
            permission: true
        })));
    }

    return data;
}

async function hasRegistred (commandName, guild) {
    let commands = null;
    guild
        ? commands = await nay.getGuildCommands(guild)
        : commands = await nay.getCommands();
    return commands.find(c => c.name === commandName);
}

async function wasModified (commandData, guild) {
    let commands = null;
    guild
        ? commands = await nay.getGuildCommands(guild)
        : commands = await nay.getCommands();
    const command = commands.find(c => c.name === commandData.name);
    return JSON.stringify({
        description: commandData.description,
        default_permission: commandData.default_permission,
        options: commandData.options
    }) !== JSON.stringify({
        description: command.description,
        default_permission: command.default_permission,
        options: command.options
    });
}