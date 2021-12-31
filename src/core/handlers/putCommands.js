module.exports = async function () {
    const cmds = nay.commands;
    const hasRegistred = async commandName => {
        const commands = await nay.getCommands();
        if (commands.find(c => c.name === commandName)) return true;
        return false;
    };


    for (const cmd of cmds) {
        const cmdPath = `${ctx.mainDir}/src/core/commands/${cmd.dir}.js`;
        cmd.execute = require(cmdPath);

        if (!await hasRegistred(cmd.name)) {
            nay.createCommand({
                name: cmd.name,
                description: cmd.description,
                dm_permission: cmd.DM
            });
        }
    }

    return cmds;
};