const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const course = require('./database/course.js');

var app = express();
app.set('views', './public/views');
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
	course.get(function (courses, profNames, optNames) {
		req.info = {
			courses: courses,
			profNames: profNames,
			optNames: optNames
		};
		next();
	});
});

app.get('/professor/:prof', function (req, res, next) {
	var filter = [];
	req.info.courses.forEach(function (course) {
		course.professors.forEach(function (professor) {
			if (professor.name === req.params.prof)
				filter.push(course);
		});
	});
	req.info.courses = filter;
	req.info.name = req.params.prof;
	next();
});

app.get('/option/:opt', function (req, res, next) {
	var filter = [];
	req.info.courses.forEach(function (course) {
		course.options.forEach(function (option) {
			if (option.name === req.params.opt)
				filter.push(course);
		});
	});
	req.info.courses = filter;
	req.info.name = req.params.opt;
	next();
});

app.use(function(req, res, next) {
	if (req.path != '/' &&
		!req.path.startsWith('/professor/') &&
		!req.path.startsWith('/option/'))
		res.status(404);
	next();
});

app.use(function (req, res) {
	console.log(req.info);
	res.render('index', req.info);
});

app.use(function(error, req, res, next) {
	console.error(error);
	res.status(500).render('500', {error: error});
});

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/db');

console.log("Server listening on port 3000");
app.listen(3000);
