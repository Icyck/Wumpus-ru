const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {


    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Sorry pal, you can't do that.");
    let pMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!pMember) return message.reply("Couldn't find rhat user, yo.");
    let role = args.join(" ").slice(22);
    if(!role) return message.reply("Specify a role!");
    let gRole = message.guild.roles.find(`name`, role)
    if(!gRole) return message.reply("Couldn't find that role.");;

    if(pMember.roles.has(gRole.id))("They have already role!");
    await(pMember.addRole(gRole.id));

    try{
    await    pMember.send(`Congrats to <@${pMember.id}> have been given the role ${gRole.name}. We tried to DM them, but their DMs are locked!`);
    }catch(e){
    message.channel.send(`Congrats to <@${pMember.id}> have been given the role ${gRole.name}.`);
    }
};


module.exports.help = {
    name:"setrole"
}