const mongoose = require('mongoose');

var course = new mongoose.Schema({
	code: String,
	title: String,
	professors: [{_id: false, name: String}],
	options: [{_id: false, name: String, required: Boolean}],
	credits: Number,
	semester: Number,
	comments: String
});

course.statics.get = function (callback) {
	this.find()
	.select('-_id code title professors options credits semester comments')
	.exec(function (err, courses) {
		if (err) console.error(err);
		var profNames = [];
		var optNames = [];
		courses.forEach(function (course) {
			course.professors.forEach(function (prof) {
				if (profNames.indexOf(prof.name) == -1)
					profNames.push(prof.name);
			});
			course.options.forEach(function (opt) {
				if (optNames.indexOf(opt.name) == -1)
					optNames.push(opt.name);
			});
		});
		callback(courses.sort(), profNames.sort(), optNames.sort());
	});
};

module.exports = mongoose.model('course', course);
