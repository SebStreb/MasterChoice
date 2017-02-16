const mongoose = require('mongoose');
const fs = require('fs-extra');

const course = require('./course.js');
const data = require('./data.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/db');

course.find(function (err, courses) {
	if (err) console.error(err);
	courses.forEach(function (row) {
		course.findByIdAndRemove(row._id, function (err) {
			if (err) console.error(err);
		});
	});
	data.forEach(function (row) {
		var document = new course(row);
		document.save(function (err) {
			if (err) console.error(err);
		});
	});
});
