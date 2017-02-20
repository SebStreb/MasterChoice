const mongoose = require('mongoose');
const course = require('./course.js');
const master = require('./master.js');
const data = require('./sinf2m.js');

mongoose.connect('mongodb://localhost/db' || process.env.MONGOLAB_URI || 'mongodb://heroku_tfxxztbl:umk61l2ukm8gnhago7lko8vnvd@ds155529.mlab.com:55529/heroku_tfxxztbl');

var sinf2m = new master({
	code : "SINF2M",
	name : "Master en Sciences Informatiques",
	credits : 120,
	options : [
		{name: "Tronc commun", required: 4, optionals: false},
		{name: "Finalité spécialisée", required: 5, optionals: false},
		{name: "Autres", required: 0, optionals: true},
		{name: "Intelligence artificielle", required: 4, optionals: true},
		{name: "Ingénierie logicielle", required: 4, optionals: true},
		{name: "Sécurité et réseaux", required: 4, optionals: true},
		{name: "Science des données", required: 4, optionals: true}
	]
});

sinf2m.save();

course.find(function (err, courses) {
	if (err) console.error(err);
	courses.forEach(function (row) {
		course.findByIdAndRemove(row._id);
	});
	data.forEach(function (row) {
		var document = new course(row);
		document.save();
	});
});

setTimeout(function () {
	console.log("done ?");
	process.exit(0);
}, 5000);
