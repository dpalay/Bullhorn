/**
CONFIG FILE DEFINITIONS:
{
    "token": "string", // the bot token from discord's developer page
    "id": "UserId", // The bot's user id
    "watchChannel": "", // 
    "DaveID": "UserId",  // ID of Dave, the author
    "watchUser": "UserId",  // Id of the user to re-broadcast to others
    "broadcastTo": ["ChanID", // ID of additional channels to add to the broadcast list
                  "ChanID", 
                  "ChanID"]
}
*/

let ME;
let config = {};
if (process.argv[2]) {
    let configfile = './' + process.argv[2];
    config = require(configfile);
} else {
    console.error("No config file given.  start with node BullHorn.js configFileName");
}

let broadcastToChannels = [];

// Set up discord.js client
const Discord = require('discord.js');
const client = new Discord.Client({
    autoReconnect: true
});

//Message Recieved
client.on('message', message => {
    // logger shouldn't check it's own stuff)
    if (message.author.id != client.user.id) {
        if (message.author.id == config.watchUser && message.channel.type == "dm") {
            console.log(`Sending message out: ${message.content}`);
            broadcastToChannels.forEach((chan) => {
                chan.send(message.content)
                    .then(message => console.log(`Sent message to ${message.channel.guild.name}#${message.channel.name}`))
                    .catch(console.error);
            });
        }
    }
});


// Connected!
client.on('ready', () => {
    console.log('Bullhorn is ready!');
    ME = client.user;
    ME.setActivity("Shawn's Minion");

    // Add channels from config file
    config.broadcastTo.forEach((id) => {
        let chan = client.channels.get(id);
        if (chan) {
            //Check if it already exists in the list
            if (broadcastToChannels.includes(chan)) {
                console.log(`Server:${chan.guild.name}\tChannel already listed. Skipping`);
            } else {

                console.log(`Server:${chan.guild.name}\tChannel:${chan.name} found from config file!`);
                if (chan.permissionsFor(ME).has("SEND_MESSAGES")) {
                    console.log(`Server:${chan.guild.name}\tI can send to that channel! Added to broadcast list`);
                    broadcastToChannels.push(chan)
                } else {
                    console.error(`Server:${chan.guild.name}\tI can't send to that channel!  I need permission to SEND_MESSAGES.`);
                }
            }
        } else {
            console.error(`Server:UNKNOWN\tCan't find any channel with ID ${id}.`);
        }
    })

    // get list of guilds (servers) and see if there is a channel named "#announcements"
    client.guilds.forEach((guild) => {
        let FindAnnouncementsPromise = new Promise((result) => { result(guild.channels.find((chan) => chan.name.toLowerCase() == "announcements")) });
        FindAnnouncementsPromise.then((chan) => {
            if (chan) {
                //Check if it already exists in the list
                if (config.broadcastTo.includes(chan.id)) {
                    console.log(`Server:${guild.name}\tAnnouncement channel already listed in config. Skipping`);
                } else {
                    console.log(`Server:${guild.name}\tAnnouncement channel found!`);
                    if (chan.permissionsFor(ME).has("SEND_MESSAGES")) {
                        console.log(`Server:${guild.name}\tI can send to that channel! Added to broadcast list`);
                        broadcastToChannels.push(chan);
                    } else {
                        console.error(`Server:${guild.name}\tI can't send to that channel!  I need permission to SEND_MESSAGES.`);
                    }
                }
            } else {
                console.error(`Server:${guild.name}\thas no "announcements" channel.`);
            }
        }).catch((e) => console.error(e));
    })


    // Find Shawn and obey his every whim.
    client.fetchUser(config.watchUser).then((Shawn) => {
        Shawn.createDM().then((dm) => {
            dm.send("Hey there, Oh Great and Powerful One.  I'm online.  Please give me a minute and I should be ready to go.").then();
            ShawnDM = dm;
        })
    }).catch((e) => console.error(e));
});



// connect
console.log("Logging in!");
client.login(config.token)
    .then()
    .catch((e) => console.error(e));