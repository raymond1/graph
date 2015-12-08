var net = require('net');

var server = net.createServer();


var count = 0;
var onConnect = function (socket){
  var socketDataReceivedFunction = function(data){
    count = count + 1;
    console.log("count %j\n", count);
    console.log(data);
  };


  socket.on('data', socketDataReceivedFunction); 

  socket.write("test");
  socket.end();
}

server.listen({port: 9000});

server.on('connection', onConnect);

