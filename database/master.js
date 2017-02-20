const mongoose = require('mongoose');

var master = new mongoose.Schema({
	code: String,
	name: String,
	credits: Number,
	options: [{_id: false, name: String, required: Number, optionals: Boolean}]
});

master.statics.get = function (callback) {
	this.find(function (err, masters) {
		if (err) console.error(err);
		callback(masters);
	});
};

master.statics.opts = function (code, callback) {
	this.findOne({code: code}, function (err, master) {
		if (err) console.error(err);
		callback(master.options);
	});
};

module.exports = mongoose.model('master', master);
