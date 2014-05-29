var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
//app.set('view engine', "html");
//app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("index.html");
});

app.use(express.static(__dirname + '/public')); 

//app.listen(port);
var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {

    socket.emit('connected', { message: 'Connected to the chat' });
	
    socket.on('send', function (data) {
		console.log("received: " + data.message);
        io.sockets.emit('message', data);
    });
	
	socket.on('join'), function(data) {
		console.log("join");
	});
});


console.log("Listening on port " + port);