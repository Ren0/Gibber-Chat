var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.get("/", function(req, res){
    res.render("index.html");
});

app.use(express.static(__dirname + '/public')); 

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {

	socket.on('connected', function (data) {
		console.log("connected: " + data.user + ' - ' + data.message);
		socket.broadcast.emit('connected', data);
	});

	// new message: broadcast it to all other users (excluding self)
    socket.on('send', function (data) {
		console.log("received: " + data.user + ' - ' + data.message);
		socket.broadcast.emit('message', data);
    });
});

console.log("Listening on port " + port);