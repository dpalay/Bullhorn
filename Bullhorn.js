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

/* 
****************************************************** 
PUT LOGIC HERE
****************************************************** 
*/




console.log("Logging in!")
    // connect
client.login(config.token)