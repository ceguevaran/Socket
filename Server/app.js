var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');
var speechText;
var five = require("johnny-five");
var board = new five.Board();
var led;


app.listen(8001);
board.on("ready", function() {
  console.log("The board is ON");
});


function handler (req, res) {
  var path = url.parse(req.url).pathname;
  console.log(path)
  if (path == "/") {
    res.writeHead(200);
    res.write('Bienvenido! Empieza visitando index.html')
    res.end();
  }else if (path == "/index.html") {
    fs.readFile(__dirname + path,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
    }); 
  }else{
    res.writeHead(404);
    res.write('Error 404 Not Found');
    res.end();
  };
};

io.on('connection', function (socket) {

  console.log('A user connected');
  socket.emit('news', "Saludos desde el servidor 8001");

  socket.on('information', function (data) {
    console.log("Session ID: " + data.sessionId);
    speechText = data.finalTranscript;
    console.log(speechText);
    led = new five.Led(13);
    if(speechText == "prender"){
      led.blink();
    }else if(speechText == "apagar"){
      console.log("AQUI")
      led.stop();
    }
  });
});


