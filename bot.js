module.exports = {
  randomMessage: function () {
    var botUsernames = ['user_7', 'user_13', 'user_17', 'user_31']
	var botChats = [
		'U2FsdGVkX18l+UIhpL81M/TKjfF54T5zF+h9lehvFq8=', // 'Hello ?' for passphrase 'lapin' 
		'U2FsdGVkX19v9ac5jMTEY4m47lyEwiuBoLOJWz6YuYI=', // 'I'm a bot' for passphrase 'lapin'
		'U2FsdGVkX1/Re5rvo9pqz/4EGCDomcJt7MXwKCCiCM8=', // 'me too!' for passphrase 'lapin'
		'U2FsdGVkX1/GApZNwnEx1YQDbpEZ27FQ4P/bNR2R0hg=' // 'lol' for passphrase 'lapin'
	];
	var randomUsername = botUsernames[Math.floor(Math.random() * botUsernames.length)];
	var randomSentence = botChats[Math.floor(Math.random() * botChats.length)];
	var data = {user: randomUsername, message: randomSentence};
	
	return data;
  }
};