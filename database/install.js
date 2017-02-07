const mongoose = require('mongoose');
const course = require('./course.js');
const data = require('./data.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/db');
data.forEach(function (row) {
	var document = new course(row);
	document.save();
});
mongoose.disconnect();
