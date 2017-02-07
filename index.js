const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const course = require('./database/course.js');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/db');

var app = express();
app.set('views', './public/views');
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	course.all(function (courses) {
		res.render('index', {courses: courses, selected: []});
	});
});

app.use(function(req, res) {
	res.status(404);
	course.all(function (courses) {
		res.render('index', {courses: courses, selected: []});
	});
});

app.use(function(error, req, res, next) {
	console.error(error);
	res.status(500).render('500', {error: error});
});

console.log("Server listening on port 3000");
app.listen(3000);
