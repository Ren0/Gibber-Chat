$(document).ready(function() {
	var socket = io.connect(document.URL);
	
	// on refresh: create a new anonymous user and notice everyone
	var randomUsername = 'user_' + Math.floor(Math.random() * 20) + 1;
	socket.emit('connected', { user: randomUsername, message: 'is joining the chat'});
	
	// when a new user joins the chat
	socket.on('connected', function (data) {
		console.log(data.user + ' - ' + data.message);
	});

	var input = []; // decrypted textarea
	var output = []; // encrypted textarea
	$("#in").html(input.join("\n"));
	
	$('#key').val('lapin') // default passphrase
	var passphrase = $('#key').val();

	// press enter in chat box: add plain text to input box, add encrypted text to output box
	$('#chatInput').keypress(function(e) {
		var message = $('#chatInput').val();
		if(e.which == 13 && message != "") {
			passphrase = $('#key').val();
			
			var encryptedMessage = CryptoJS.AES.encrypt(message, passphrase);
			var decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, passphrase).toString(CryptoJS.enc.Latin1);
						
			socket.emit('send', { user: randomUsername, message: encryptedMessage.toString()});
						
			output.push(encryptedMessage);
			$("#out").html(output.join("\n"));	
			input.push(randomUsername + ' - ' + decryptedMessage);
			$("#in").html(input.join("\n"));
			
			$('#chatInput').val('')
		}
	});
	
	// change the passphrase: rework all input box messages
	$('#key').keyup(function(){
		passphrase = $('#key').val();
		$("#in").html("");
		for(var i=0; i<output.length; i++) {
			input[i] = input[i].split(' - ')[0] + ' - ' + CryptoJS.AES.decrypt(output[i].toString(), passphrase).toString(CryptoJS.enc.Latin1);
		}
		
		$("#in").html(input.join("\n"));
		$("#out").html(output.join("\n"));
	});
	
	// receive a message
	socket.on('message', function (data) {	
		output.push(data.message);
		$("#out").html(output.join("\n"));
		
		input.push(data.user + ' - ' + CryptoJS.AES.decrypt(data.message, passphrase).toString(CryptoJS.enc.Latin1));
		$("#in").html(input.join("\n"));
    });
});