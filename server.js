var express = require("express");
var bot = require('./bot');

var app = express();
var port = 3700;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public')); 

var io = require('socket.io').listen(app.listen(port));

var randomUsername = '';
var allUsers = [];
io.sockets.on('connection', function (user) {
	var x = Math.floor(Math.random() * 98) + 1;
	randomUsername = 'user_' + x;
	allUsers.push({id: user.id, name: randomUsername});
	console.log('XXX - ' + JSON.stringify(allUsers));
		
	user.emit('assign', {user: randomUsername, message: 'assignn'});
	
	// not needed: handled by io.sockets.on('connection',   ?
	//user.on('notifyConnected', function (data) {
		//console.log('CONNECTED - ' + JSON.stringify(allUsers));
	//});
	
	 user.on('disconnect', function (data) {
		var userId = user.id;
		allUsers.splice(allUsers.indexOf(userId), 1);
		console.log('DISCONNECTED -' + JSON.stringify(allUsers));
    });

	// new message: broadcast it to all other users (excluding self)
    user.on('send', function (data) {
		user.broadcast.emit('message', data);
    });	
});

// generate random bots sending random messages on a random interval
var botsJob;
var randomChat = function () {
	var randomInterval = Math.floor(Math.random() * 5000) + 1;
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