const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const pug = require('pug');
const course = require('./database/course.js');
const master = require('./database/master.js');
const table = pug.compileFile('public/views/table.pug')

var app = express();
app.set('views', './public/views');
app.set('view engine', 'pug');

app.use(morgan('[:date[clf]]\t:status\t:url', {
	skip: function (req, res) {
		return req.path.startsWith('/img') || req.path.startsWith('/scripts') || req.path.startsWith('/stylesheets');

	}
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res, next) {
	master.get(function (masters) {
		res.render('masters', {masters: masters});
	});
});

app.use('/:master', function (req, res, next) {
	master.opts(req.params.master, function (options) {
		course.get(req.params.master, function (courses, professors) {
			req.info = {
				master: req.params.master,
				courses: courses,
				professors: professors,
				options: options
			};
			next();
		});
	});
});

app.get('/:master/all', function (req, res) {
	res.send(table({courses: req.info.courses}));
	res.end();
});

app.get('/:master/professor/:prof', function (req, res) {
	var filter = [];
	req.info.courses.forEach(function (course) {
		course.professors.forEach(function (professor) {
			if (professor.name === req.params.prof)
				filter.push(course);
		});
	});
	res.send(table({courses: filter, name: req.params.prof}));
	res.end();
});

app.get('/:master/option/:opt', function (req, res, next) {
	var filter = [];
	req.info.courses.forEach(function (course) {
		course.options.forEach(function (option) {
			if (option.name === req.params.opt)
				filter.push(course);
		});
	});
	res.send(table({courses: filter, name: req.params.opt}));
	res.end();
});

app.get('/:master', function (req, res) {
	res.render('index', req.info);
});

app.use(function(error, req, res, next) {
	console.error(error);
	res.status(500).render('500', {error: error});
});

function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) return val; // named pipe
	if (port >= 0) return port; // port number
	return false;
}

mongoose.connect('mongodb://localhost/db' || process.env.MONGOLAB_URI || 'mongodb://heroku_tfxxztbl:umk61l2ukm8gnhago7lko8vnvd@ds155529.mlab.com:55529/heroku_tfxxztbl');

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

console.log("Server listening on port " + port);
app.listen(port);
