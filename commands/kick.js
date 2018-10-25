const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  let incidentchannel = message.guild.channels.find(`name`, "incidents");
  if(!incidentchannel) return message.channel.send("Can't find incidents channel.");
  let logchannel = message.guild.channels.find(`name`, "wumpuslog");
  if(!logchannel) return message.channel.send("Can't find log channel.");
  if (reason.length < 1) return message.reply('You must supply a reason for the kick.');
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to kick them.').catch(console.error);

  if (!message.guild.member(user).kickable) return message.reply('I cannot kick that member');
  message.guild.member(user).kick();

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Action:', 'Kick')
    .addField('User:', `${user.username}#${user.discriminator} (${user.id})`)
    .addField('Modrator:', `${message.author.username}#${message.author.discriminator}`)
    .addField('Reason', reason);

    user.send(`You kicked from ${message.guild.name}, reason : ${reason}`)
    message.reply("***User has kicked!***")
    logchannel.send(embed);
  return bot.channels.get(incidentchannel.id).sendEmbed(embed);
};

module.exports.help = {
    name:"kick"
};