const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const install = require('./install.js');

var app = express();
app.set('views', './public/views');
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.render('index');
});

app.use(function(req, res) {
	res.status(404);
	res.redirect('/');
});

app.use(function(error, req, res, next) {
	res.status(500);
	res.render('500');
});

console.log("Dumping database");
fs.unlink("courses.db", function () {
	console.log("recreating database");
	install.createDatabase();

	console.log("Server listening on port 3000");
	app.listen(3000);
});
