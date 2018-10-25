const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    let user = message.mentions.users.first();
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
  if(!wUser) return message.reply("Couldn't find them yo");
    let warnlevel = warns[wUser.id].warns;
    let mutelevel = mutes[user.id].mutes;
    let unmutelevel = unmutes[user.id].unmutes
    message.reply(`<@${wUser.id}> has ${warnlevel} warnings. Mutes has ${mutelevel} and ${unmutelevel} unmutes!`);
}

module.exports.help = {
    name:"history"
}