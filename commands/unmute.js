const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    let user = message.mentions.users.first();
   
    let iMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!iMember) return message.reply("Couldn't find rhat user, yo.");

    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Can't find incidents channel.");

  ///let muteRole = bot.guilds.get(message.guild.id).roles.find('name', 'muted');
  
  let sRole = message.guild.roles.find(`name`, `muted`)
  if(!sRole) return message.reply("Couldn't find muted role.");;

  
  if(iMember.roles.has(sRole.id));
    await(iMember.removeRole(sRole.id));

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Action:', 'Unmute')
    .addField('User:', `${user.username}#${user.discriminator}`)
    .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`);

    
    incidentchannel.send(embed);
    message.reply("***User unmuted!***")
  
}

module.exports.help = {
    name:"unmute"
}