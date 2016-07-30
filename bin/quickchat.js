#! /usr/bin/env node

if (process.argv.length !== 3) {
  
  // HELP message
  console.log("\nSAMPLE USAGE\n");
  console.log("quickchat 3000");
  console.log("    Start chat server on TCP port 3000\n");
  console.log("quickchat 123.28.0.1:3000");
  console.log("    Connect to existing chat server" +
              " at IP address 123.28.0.1 port 3000\n");
  
} else {
  
  const ip = require('ip'),
        address = process.argv[2],  // either <IP>:<port>, or <port>.
        colon = address.indexOf(":"),
        // readline is required to respond to user typing in stdin.
        rl = require('readline').createInterface({input: process.stdin});
  
  if (colon > 0) {  // will be -1 for a server address, which has no colon.
    
    // CLIENT Code
    // 'address' holds the IP address and port, separated by a colon.
    var ipaddress = address.slice(0,colon);
    var port = address.slice(colon+1);
    console.log("\nCreating New Client.\n");
    // display what the other chatter needs to make a client connection.
    console.log(`Attempting to connect to IP address ${ipaddress} port ${port}...`);
    // 'client' is a socket, we set it up directly after a 'connect' event.
    var client = require('net').connect({
      port: parseInt(port), address: parseInt(ipaddress)
    });
    client.on('connect', function() { setupSocket(client); });
    
  } else {
    
    // SERVER Code
    // 'address' holds the port number (as a string)
    console.log("\nCreating New Server.\n");
    console.log("To CONNECT to this server:");
    console.log("> quickchat " + ip.address() + ":" + address + "\n");
    console.log("Listening for connections on port " + address + "...")
    // 'server' is NOT a socket - we get that from the 'connection' event
    const server = require('net').createServer().listen(parseInt(address));
    server.on('connection', setupSocket);
    
  }
  
  function setupSocket(sock) {
    console.log("Connection made!\n");
    // write data received through the socket to stdout.
    sock.on('data', function(data) { console.log(' >> ' + data.toString()); });
    // send lines from stdin through the socket.
    rl.on('line', function(line) { sock.write(line); });
  }
  
}
