const fs = require('fs');

var courses = [];
var data = fs.readFileSync("./database/MasterChoice.csv", 'utf8');

data.trim().split('\r').forEach(function (course, index) {
	if (index == 0) return;
	var fields = course.split(';');
	var professors = [];
	fields[2].split(',').forEach(function (professor, index) {
		professors[index] = {name: professor.trim()};
	});
	var options = [];
	fields[3].split(',').forEach(function (option, index) {
		if (option.includes('(O)'))
			options[index] = {name: option.substring(0, option.length-4).trim(), required: true};
		else
			options[index] = {name: option.trim(), required: false};
	});
	courses[index-1] = {
		code : fields[0],
		title : fields[1],
		professors : professors,
		options : options,
		semester : fields[4],
		credits : fields[5],
		comments : fields[6]
	};
});

module.exports = courses;
