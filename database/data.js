const fs = require('fs');

var courses = new Array();
var data = fs.readFileSync("./database/MasterChoice.csv", 'utf8');

data.trim().split('\r').forEach(function (course, index) {
	if (index == 0) return;
	var fields = course.split(';');
	var professors = new Array();
	fields[2].split(',').forEach(function (professor, index) {
		professors[index] = {name: professor};
	});
	var options = new Array();
	fields[3].split(',').forEach(function (option, index) {
		if (option.includes('(O)'))
			options[index] = {name: option.substring(0, option.length-4), required: true};
		else
			options[index] = {name: option, required: false};
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
