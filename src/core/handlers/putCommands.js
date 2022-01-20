module.exports = async function () {
    const cmds = nay.commands;

    for (const cmd of cmds) {
        const cmdPath = `${ctx.mainDir}/src/core/commands/${cmd.dir}.js`;
        cmd.execute = require(cmdPath);
        cmd.acess.forDevs
            ? putDevCommand({
                name: cmd.name,
                description: cmd.description
            })
            : await hasRegistred(cmd.name)
                ? nay.createCommand({
                    name: cmd.name,
                    description: cmd.description,
                    dm_permission: cmd.DM
                })
                : null;
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
    if (guild) {
        const commands = await nay.getGuildCommands(guild);
        return commands.find(c => c.name === commandName);
    }
    const commands = await nay.getCommands();
    return commands.find(c => c.name === commandName);
}