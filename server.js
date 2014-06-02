var express = require("express");
var bot = require('./bot');

var app = express();
var port = 3700;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public')); 

var io = require('socket.io').listen(app.listen(port));

var allUsers = [];
io.sockets.on('connection', function (user) {
	allUsers.push(user.id);
	user.emit(user.id);
	
	user.broadcast.emit('connected', {user: user.id, message: ' has joined the chat', users: allUsers});
	
	user.on('connected', function (data) {
		user.emit('connected', {user: user.id, message: ' has joined the chat', users: allUsers});
		console.log(allUsers);
	});
	
	 user.on('disconnect', function (e) {
		var userId = user.id;
		allUsers.splice(allUsers.indexOf(userId), 1);
		user.broadcast.emit('disconnected', {user: userId, message: ' has left the chat', users: allUsers});
		console.log(allUsers);
        //io.sockets.emit('count', {number: count});
    });

	// new message: broadcast it to all other users (excluding self)
    user.on('send', function (data) {
		user.broadcast.emit('message', data);
    });	
});

// generate random bots sending random messages on a random interval
var botsJob;
var randomChat = function () {
	var randomInterval = Math.floor(Math.random() * 1000) + 1;
	io.sockets.emit('message', bot.randomMessage());
	botsJob = setTimeout(randomChat, randomInterval);
}
//randomChat();

// routes
app.get("/", function(req, res){
    res.render("index.html");
});
app.get("/addBots", function(req, res){
	randomChat();
	res.redirect('/');
});
app.get("/removeBots", function(req, res){
	clearTimeout(botsJob);
	res.redirect('/');
});

console.log("Listening on port " + port);