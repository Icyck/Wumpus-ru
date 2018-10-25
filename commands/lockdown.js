const Discord = require("discord.js");
const ms = require('ms');

module.exports.run = async (bot, message, args) => {
   if(!bot.lockit) bot.lockit = [];
   let time = args.join(' ');
   let validUnlocks = ['release', 'unlock'];
   if(!time) return message.reply("You must set a duration for the lockdown in either hours, minutes or seconds");

   if(validUnlocks.includes(time)){
       message.channel.overwritePermission(message.guild.id,{
           SEND_MESSAGES: null
       }).then(() => {
           message.channel.sendMessage("Lockdown lifted.");
           clearTimeout(bot.lockit[message.channel.id]);
           delete bot.lockit[message.channel.id];
       }).cath(error => {
           console.log(error);
       })
   } else {
       message.channel.overwritePermission(message.guild.id,{
           SEND_MESSAGES: false
       }).then(message.channel.sendMessage(`Channel locked down for ${ms(ms(time), {long:true})}`)).then(() => {
           bot.lockit[message.channel.id] = setTimeout(() => {
               message.channel.overwritePermission(message.guild.id), {
                   SEND_MESSAGES: null
               }.then(message.channel.sendMessage("Lock down lifted")).cath(console.error);
               delete bot.lockit[message.channel.id];
           }, ms(time));

       }).cath(error => {
           console.log(error);
       })
   }
}

module.exports.help = {
    name:"lockdown"
}