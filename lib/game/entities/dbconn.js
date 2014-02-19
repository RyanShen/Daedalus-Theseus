var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	var dialogSchema = mongoose.Schema({
		name: String
	})

	var dialog = mongoose.model('dialog', dialogSchema)
});