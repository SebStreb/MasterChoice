const mongoose = require('mongoose');
const fs = require('fs-extra');
const spawn = require('child_process').spawn;

const course = require('./course.js');
const data = require('./data.js');
const db = "./database/db/";

fs.remove(db, function (err) {
	if (err) console.error(err);
	fs.mkdir(db, function (err) {
		if (err) console.error(err);

		const mongod = spawn("mongod", ["--dbpath", db]);
		mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/db');
		data.forEach(function (row) {
			var document = new course(row);
			document.save();
		});
		mongoose.disconnect(function () {
			console.log("done");
		});
	});
});
