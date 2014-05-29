$(document).ready(function() {
	var socket = io.connect(document.URL);
	socket.emit("join", "test", function(successful, users) {
		console.log(successful);
		console.log(users);
	});

	var input = [];
	var output = [];
	$('#key').val('lapin')
	$("#in").html(input.join("\n"));

	// press enter in chat box: add plain text to input box, add encrypted text to output box
	$('#chatInput').keypress(function(e) {
		var message = $('#chatInput').val();
		if(e.which == 13 && message != "") {
			var passphrase = $('#key').val();
			
			var encryptedMessage = CryptoJS.AES.encrypt(message, passphrase);
			var decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, passphrase).toString(CryptoJS.enc.Latin1);
						
			socket.emit('send', { message: encryptedMessage.toString(), username: 'toto' });						
						
			output.push(encryptedMessage);
			$("#out").html(output.join("\n"));
			
			input.push(decryptedMessage);
			$("#in").html(input.join("\n"));
			
			$('#chatInput').val('')
		}
	});
	
	// change the passphrase: rework all input box messages
	$('#key').keyup(function(){
		// test in browser: CryptoJS.AES.encrypt("t", "test").toString(); CryptoJS.AES.decrypt("U2FsdGVkX18+X7jWQL1ZVKAKk0TNks6qqvb8NTxeSJc=", "test").toString(CryptoJS.enc.Latin1);
		var passphrase = $('#key').val();
		$("#in").html("");
		for(var i=0; i<output.length; i++) {
			input[i] = CryptoJS.AES.decrypt(output[i].toString(), passphrase).toString(CryptoJS.enc.Latin1);
		}
		
		$("#in").html(input.join("\n"));
		$("#out").html(output.join("\n"));
	});
	
	// receive a message: TODO
	
});