import { map } from '../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/async';

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
            _.each(config.broadcastTo, (chan) => {
                client.channels.find("id", chan).send(message.content)
            })

        }
    }
})


// Connected!
client.on('ready', () => {
    console.log('Bullhorn is ready!');
    ME = client.user
    ME.setGame("Shawn's Minion")
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