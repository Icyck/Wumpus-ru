const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
  if(args[0] == "help"){
    message.reply("Usage: !removerole <user> <role>");
    return;
  }
    let iMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!iMember) return message.reply("Couldn't find rhat user, yo.");
    let role = args.join(" ").slice(22);
    if(!role) return message.reply("Specify a role!");
    let sRole = message.guild.roles.find(`name`, role)
    if(!sRole) return message.reply("Couldn't find that role.");;
  
    if(iMember.roles.has(sRole.id));
    await(iMember.removeRole(sRole.id));
  
    try{
    await    pMember.send(`RIP to <@${iMember.id}> have been remove the role ${sRole.name}. We tried to DM them, but their DMs are locked!`);
    }catch(e){
    message.channel.send(`RIP to <@${iMember.id}> have been remove the role ${sRole.name}.`);
    }
};

module.exports.help = {
    name:"removerole"
}