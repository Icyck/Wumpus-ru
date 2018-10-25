const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    let kiUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kiUser) return errors.cantfindUser(message.channel);
    message.reply(`User id: ${kiUser.id}`);
}

module.exports.help = {
    name:"userid"
}