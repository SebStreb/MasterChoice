const mongoose = require('mongoose');
const course = require('./course.js');
const data = require('./data.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://heroku_tfxxztbl:umk61l2ukm8gnhago7lko8vnvd@ds155529.mlab.com:55529/heroku_tfxxztbl');

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

setTimeout(function () {
	console.log("done ?");
	process.exit(0);
}, 5000);
