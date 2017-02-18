const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const pug = require('pug');
const course = require('./database/course.js');
const table = pug.compileFile('public/views/table.pug')

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

app.get('/all', function (req, res) {
	res.send(table(req.info));
	res.end();
});

app.get('/professor/:prof', function (req, res) {
	var filter = [];
	req.info.courses.forEach(function (course) {
		course.professors.forEach(function (professor) {
			if (professor.name === req.params.prof)
				filter.push(course);
		});
	});
	req.info.courses = filter;
	req.info.name = req.params.prof;
	res.send(table(req.info));
	res.end();
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
	res.send(table(req.info));
	res.end();
});

app.use(function(req, res, next) {
	if (req.path != '/') res.status(404);
	next();
});

app.use(function (req, res) {
	res.render('index', req.info);
});

app.use(function(error, req, res, next) {
	console.error(error);
	res.status(500).render('500', {error: error});
});

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://heroku_tfxxztbl:umk61l2ukm8gnhago7lko8vnvd@ds155529.mlab.com:55529/heroku_tfxxztbl');

function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) return val; // named pipe
	if (port >= 0) return port; // port number
	return false;
}

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

console.log("Server listening on port " + port);

server.listen(port);
