const Discord = require("discord.js");
const secConv = require("seconds-converter");
const client = new Discord.Client();
let timers = [];

let embedTemplate = new Discord.RichEmbed()



// Log that the bot has started and then set the activity
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('A Simple Melody');
});

client.on('message', message => {
    if (message.author.bot) return;

    const strArgs = message.content.split(/\|/);
    strArgs.shift();

    const args = message.content.slice("!".length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commandName !== "settimer") return;

    let timeRemaining = getSeconds(args[0]);
    timeRemaining -= timeRemaining % 60;
    let title = strArgs.length > 0 ? strArgs[0] : "A Simple Countdown Timer";
    let description = strArgs.length > 1 ? strArgs[1] : "A simple countdown timer, counting towards the end of days!";
    console.log(timeRemaining);
    message.channel.send(getEmbed(title, description, timeRemaining)).then(sent => {
        timers[sent.id] = {};
        timers[sent.id].timeRemaining = timeRemaining;
        timers[sent.id].name = title;
        timers[sent.id].description = description;
        let interval = setInterval(function(){
            if (timers[sent.id] === null) { clearInterval(interval); }
            if (timers[sent.id].timeRemaining > 60) {
                timers[sent.id].timeRemaining -= 60;
                sent.edit(getEmbed(timers[sent.id].name, timers[sent.id].description, timers[sent.id].timeRemaining)).catch(() => { timers[sent.id] = null; clearInterval(interval); });
            } else {
                timers[sent.id] = null;
                sent.edit(getEmbed(timers[sent.id].name, timers[sent.id].description, timers[sent.id].timeRemaining)).catch(() => { timers[sent.id] = null; });
                clearInterval(interval);
            }
        }, 60000);
    });

    message.delete().catch();

});

function getSeconds(datetime) {
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let times = datetime.split(':');
    if (times.length === 1) {
        return parseInt(times[0]);
    } if (times.length === 2) {
        minutes = parseInt(times[0]);
        seconds = parseInt(times[1]);
    } if (times.length === 3) {
        hours = parseInt(times[0]);
        minutes = parseInt(times[1]);
        seconds = parseInt(times[2]);
    } if (times.length === 4) {
        days = parseInt(times[0]);
        hours = parseInt(times[1]);
        minutes = parseInt(times[2]);
        seconds = parseInt(times[3]);
    }
    seconds += days*24*60*60;
    seconds += hours*60*60;
    seconds += minutes*60;
    return seconds;
}

function getDateFormat(seconds) {
    let result = "";
    let convertedTime = secConv(seconds);
    if (convertedTime.days > 0) {
        let val = convertedTime.days > 1 ? " days " : " day ";
        result += String(convertedTime.days) + val;
    } if (convertedTime.hours > 0) {
        let val = convertedTime.hours > 1 ? " hours " : " hour ";
        result += String(convertedTime.hours) + val;
    } if (convertedTime.minutes > 0) {
        let val = convertedTime.minutes > 1 ? " minutes " : " minute ";
        result += String(convertedTime.minutes) + val;
    }
    return result;
}

function getEmbed(title, description, timeRemaining) {
    let embed = new Discord.RichEmbed()
        .setColor('#8d3ac5')
        .setThumbnail("https://cdn.pixabay.com/photo/2013/07/13/13/34/hourglass-161125_960_720.png")
        .setAuthor('TimeoutBot', 'https://cdn.pixabay.com/photo/2015/11/17/02/18/hourglass-1046841_960_720.png')
        .setFooter("Bot Created By CelesteMagisteel | https://fluxinc.xyz");
    embed.setTitle(title); embed.setDescription(description);
    if (timeRemaining > 60) { embed.addField("Time Remaining", getDateFormat(timeRemaining), true); }
    else { embed.addField("Timer Complete", "The Countdown has finished!", true); }
    return embed;
}

client.login(/**token here**/"");