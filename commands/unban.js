const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    let reason = args.slice(1).join(' ')
    let user = args[0];
    if(reason.length < 1) return message.reply("You must supply a reason of the unban!");
    if(!user) return message.reply('You must supply a user UserResolvable, such a Userid!').catch(console.error);
    message.guild.unban(user);
    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Can't find incidents channel.");


    const unban = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTimestamp()
    .addField("Action", "Unban")
    .addField("User:", `${user.username}#${message.author.discriminator}`)
    .addField("Moderator", `${message.author.username}#${message.author.discriminator}`);

    message.reply(`This user unbanned !`);
    user.search(`You unbanned in ${message.guild.name}, reason: ${reason}`);
    return incidentchannel.send(unban);
}

module.exports.help = {
    name:"unban"
}