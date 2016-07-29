#! /usr/bin/env node

// USAGE
//
// quickchat 3000
//     Start chat server on TCP port 3000
//
// quickchat 123.28.0.1:3000
//     Connect to existing chat server at IP address 123.28.0.1 port 3000
//

if (process.argv.length !== 3) {
  
  console.log("Insert HELP message here!");
  
} else {
  
  const ip = require('ip'),
        address = process.argv[2],
        colon = address.indexOf(":");
  
  if (colon > 0) {
    // CLIENT Code
    var ipaddress = address.slice(0,colon);
    var port = address.slice(colon+1);
    console.log("\nCreating New Client.\n");
    console.log(`Attempting to connect to IP address ${ipaddress} port ${port}...`);
    var client = require('net').connect({
      port: parseInt(port), address: parseInt(ipaddress)});
    client.on('connect', function(connection) {
      console.log('Connection made!');
      client.write('Howdy!');
    });
    client.on('data', function(data) {
      console.log(data.toString());
    });
    
  } else {
    // SERVER Code
    console.log("\nCreating New Server.\n");
    console.log("To CONNECT to this server:");
    console.log("> quickchat " + ip.address() + ":" + address + "\n");
    console.log("Listening for connections on port " + address + "...")
    const server = require('net').createServer().listen(parseInt(address));
    server.on('connection', function(connection) {
      console.log("Connection made!");
      connection.on('data', function(data) {
        console.log(data.toString());
      });
      connection.write("whazzup!");
    });
  }
  
}
