var sessionData = {};

var handlers = {
	saveSessionData : function() {
		localStorage.setItem("session", JSON.stringify(sessionData));
	},
	getSessionData : function() {
		var retrievedObject = localStorage.getItem("session");
		return JSON.parse(retrievedObject);
	},
	clearSessionData : function() {
		localStorage.clear();
		return false;
	}
};