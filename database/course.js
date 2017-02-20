const mongoose = require('mongoose');

var course = new mongoose.Schema({
	code: String,
	title: String,
	professors: [{_id: false, name: String}],
	options: [{_id: false, name: String, required: Boolean}],
	credits: Number,
	semester: Number,
	comments: String,
	master: String
});

course.statics.get = function (master, callback) {
	this.find({master: master})
	.select('-_id code title professors options credits semester comments')
	.exec(function (err, courses) {
		if (err) console.error(err);
		var professors = [];
		courses.forEach(function (course) {
			course.professors.forEach(function (prof) {
				if (professors.indexOf(prof.name) == -1)
					professors.push(prof.name);
			});
		});
		callback(courses.sort(), professors.sort());
	});
};

module.exports = mongoose.model('course', course);
