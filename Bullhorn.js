/*
CONFIG FILE DEFINITIONS:
{
    "token": "string", // the bot token from discord's developer page
    "id": "UserId", // The bot's user id
    "watchChannel": "", // 
    "DaveID": "UserId",  // ID of Dave, the author
    "watchUser": "UserId",  // Id of the user to re-broadcast to others
    "broadcastTo":   // List of channel IDs to post the messages to
       ["ChannelId",
        "ChannelId",
        "ChannelId",
        "ChannelId",
        "ChannelId",
        "ChannelId",
        "ChannelId"
    ]
}
*/


let config = {};
if (process.argv[2]) {
    let configfile = './' + process.argv[2]
    config = require(configfile);
} else {
    console.error("No config file given.  start with node BullHorn.js configFileName")
}

// Set up discord.js client
const Discord = require('discord.js');
const client = new Discord.Client({
    autoReconnect: true
});

// Get other libraries
const _ = require('underscore');


//Message Recieved
client.on('message', message => {
    // logger shouldn't check it's own stuff)
    if (message.author.id != client.user.id) {
        if (message.author.id == config.watchUser && message.channel.type == "dm") {
            console.log(`Sending message out: ${message.content}`)
            _.each(config.broadcastTo, (chan) => {
                let sendToChannel = client.channels.get(chan)
                if (sendToChannel) {
                    sendToChannel.send(message.content)
                        .then(message => console.log(`Sent message to ${message.channel.guild.name}#${message.channel.name}`))
                        .catch(console.error)
                } else {
                    console.log(`ERROR: Could not send to channel ${chan}.  Channel was not found. This bot might not be on the right server for it.`)
                }
            })

        }
    }
})


// Connected!
client.on('ready', () => {
    console.log('Bullhorn is ready!');
    ME = client.user
    ME.setActivity("Shawn's Minion")
    client.fetchUser(config.watchUser).then((Shawn) => {
        Shawn.createDM().then((dm) => {
            dm.send("Hey there, Oh Great and Powerful One.  I'm online and ready to go.").then()
            ShawnDM = dm;
        })
    }).catch((e) => console.error(e))
});



// connect
console.log("Logging in!")
client.login(config.token)