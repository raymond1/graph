var static = require('node-static');
var fileServer = new static.Server('../client/');
var http = require('http');

http.createServer((req,res)=>{
  req.addListener('end', function(){
    fileServer.serve(req, res);
  }).resume();
}).listen(9000);
