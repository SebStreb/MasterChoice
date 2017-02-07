const mongoose = require('mongoose');

var course = new mongoose.Schema({
	code: String,
	title: String,
	professors: [{name: String}],
	options: [{name: String, required: Boolean}],
	credits: Number,
	semester: Number,
	comments: String
});

course.statics.all = function (callback) {
	this.find(function (err, courses) {
		if (err) console.error(err);
		callback(courses);
	});
};

module.exports = mongoose.model('course', course);
