const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
  let reason = args.slice(1).join(' ')
  let user = message.mentions.users.first();
  if(reason.length < 1) return message.reply("You must supply a reason of the ban!");
  if(message.mentions.users.size < 1) return message.reply('You must mentions someone to ban them').catch(console.error);
  let incidentchannel = message.guild.channels.find(`name`, "incidents");
  if(!incidentchannel) return message.channel.send("Can't find incidents channel.");
  let wumpuschannel = message.guild.channels.find(`name`, "wumpuslog");
  if(!wumpuschannel) return message.channel.send("Can't find log channel.");


  if(!message.guild.member(user).bannable) return message.reply("No.");
  message.guild.ban(user, 2);

  const banw = new Discord.RichEmbed()
  .setDescription("Function")
  .setColor('RANDOM')
  .setTimestamp()
  .addField("Action", "Ban")
  .addField("User:", `${user.username}#${message.author.discriminator}`)
  .addField("Moderator", `${message.author.username}#${message.author.discriminator}`);

  message.reply(`User ${user.username} has banned <:BanHammer:498911349061976074>`)
  wumpuschannel.send(`New ban: ${banw}`)
user.send(`You banned in ${message.guild.name}, reason: ${reason}`)
  return incidentchannel.send(banw);
  
};

module.exports.help = {
    name:"ban"
};