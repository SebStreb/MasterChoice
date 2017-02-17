$(document).ready(function () {
	$("#table").load('/all');
	$("#name1").text("");
	$("#name2").text("");
	$("#nameProf").text("");
	$("#nameOpt").text("");
	reset();
});

function showAll() {
	$("#table").load('/all', function () {
		selected.forEach(function (course) {
			if (course.removed) return;
			$("#"+course.code).addClass("success");
		});
	});
	$("#name1").text("");
	$("#name2").text("");
	$("#nameProf").text("");
	$("#nameOpt").text("");
}

function filterProf(prof) {
	console.log(prof);
	var query = '/professor/'+prof.replace(/ /g, "%20");
	$("#table").load(query, function () {
		selected.forEach(function (course) {
			if (course.removed) return;
			$("#"+course.code).addClass("success");
		});
	});
	$("#name1").text(" > " + prof);
	$("#name2").text(" > " + prof);
	$("#nameProf").text(prof);
	$("#nameOpt").text("");
};

function filterOpt(opt) {
	console.log(opt);
	var query = '/option/'+opt.replace(/ /g, "%20");
	$("#table").load(query, function () {
		selected.forEach(function (course) {
			if (course.removed) return;
			$("#"+course.code).addClass("success");
		});
	});
	$("#name1").text(" > " + opt);
	$("#name2").text(" > " + opt);
	$("#nameProf").text("");
	$("#nameOpt").text(opt);
};

function reset() {
	//TODO rajouter une fenêtre de confirmation
	selected = [];
	courses.forEach(function (course) {
		$("#"+course.code).removeClass("success");
	});
	calculateCredits();
};

function save() {
	//TODO
};

function from() {
	//TODO
};

function addOrRemove(code, year) {
	var hasBeenFound = false;
	selected.forEach(function (course) {
		if (course.code === code && course.removed === false) {
			console.log("TODO : find a better way to remove a selection");
			course.removed = true;
			hasBeenFound = true;
		} else if (course.code === code) {
			course.removed = false;
			course.year = year;
			hasBeenFound = true;
		}
	});
	if (!hasBeenFound) {
		$("#"+code).addClass("success");
		courses.forEach(function (course) {
			if (course.code === code) {
				selected.push({
					code: code,
					title: course.title,
					options: course.options,
					credits: course.credits,
					year: year,
					semester: course.semester,
					removed: false
				});
			}
		});
	}
	calculateCredits();
};

function calculateCredits() {
	var q1T = 0, q2T = 0, q3T = 0, q4T = 0;
	var q1c = [], q2c = [], q3c = [], q4c = [];
	var opts = {"1" : 0, "2" : 0, "3" : 0, "3p" : 0, "4" : 0, "4p" : 0,
				"5" : 0, "5p" : 0, "6" : 0, "6p" : 0, "7" : 0};
	courses.forEach(function (course) {
		$("#"+course.code).removeClass("success");
	});
	selected.forEach(function (course) {
		if (course.removed) return;
		$("#"+course.code).addClass("success");
		if (course.year === 1) {
			if (course.semester === 1) {
				q1T += course.credits;
				q1c.push("[" + course.code + "] " + course.title);
			} else if (course.semester === 2) {
				q2T += course.credits;
				q2c.push("[" + course.code + "] " + course.title);
			} else {
				q1T += course.credits / 2;
				q2T += course.credits / 2;
				q1c.push("[" + course.code + "] " + course.title);
				q2c.push("[" + course.code + "] " + course.title);
			}
		} else {
			if (course.semester === 1) {
				q3T += course.credits;
				q3c.push("[" + course.code + "] " + course.title);
			} else if (course.semester === 2) {
				q4T += course.credits;
				q4c.push("[" + course.code + "] " + course.title);
			} else {
				q3T += course.credits / 2;
				q4T += course.credits / 2;
				q3c.push("[" + course.code + "] " + course.title);
				q4c.push("[" + course.code + "] " + course.title);
			}
		}
		course.options.forEach(function (option) {
			switch (option.name) {
				case "Tronc commun":
					opts["1"]++;
					break;
				case "Finalité spécialisée":
					opts["2"]++;
					break;
				case "Intelligence artificielle":
					if (option.required)
						opts["3"]++;
					else
						opts["3p"]++;
					break;
				case "Ingénierie logicielle":
					if (option.required)
						opts["4"]++;
					else
						opts["4p"]++;
					break;
				case "Sécurité et réseaux":
					if (option.required)
						opts["5"]++;
					else
						opts["5p"]++;
					break;
				case "Science des données":
					if (option.required)
						opts["6"]++;
					else
						opts["6p"]++;
					break;
				case "Autres":
					opts["7"]++;
					break;
				default:
					console.log("WTF is " + option.name);
			}
		});
	});
	populateHTML({
		q1T: q1T, q2T: q2T, q3T: q3T, q4T: q4T,
		q1c: q1c, q2c: q2c, q3c: q3c, q4c: q4c,
		opts : opts
	});
};

function populateHTML(choice) {
	$("#total").text(choice.q1T+choice.q2T+choice.q3T+choice.q4T);
	$("#total2").text(choice.q1T+choice.q2T+choice.q3T+choice.q4T);
	$("#q1").text(choice.q1T);
	$("#q2").text(choice.q2T);
	$("#q3").text(choice.q3T);
	$("#q4").text(choice.q4T);
	var q1cS = "";
	choice.q1c.forEach(function (course) {
		q1cS += "<li>" + course + "</li>";
	});
	var q2cS = "";
	choice.q2c.forEach(function (course) {
		q2cS += "<li>" + course + "</li>";
	});
	var q3cS = "";
	choice.q3c.forEach(function (course) {
		q3cS += "<li>" + course + "</li>";
	});
	var q4cS = "";
	choice.q4c.forEach(function (course) {
		q4cS += "<li>" + course + "</li>";
	});
	$("#q1c").html(q1cS);
	$("#q2c").html(q2cS);
	$("#q3c").html(q3cS);
	$("#q4c").html(q4cS);
	$("#o1").text(choice.opts["1"] + " cours requis sur 4");
	$("#o2").text(choice.opts["2"] + " cours requis sur 5");
	$("#o3").text(choice.opts["3"] + " cours requis sur 4");
	$("#o3p").text(choice.opts["3p"] + " cours supplémentaires");
	$("#o4").text(choice.opts["4"] + " cours requis sur 4");
	$("#o4p").text(choice.opts["4p"] + " cours supplémentaires");
	$("#o5").text(choice.opts["5"] + " cours requis sur 4");
	$("#o5p").text(choice.opts["5p"] + " cours supplémentaires");
	$("#o6").text(choice.opts["6"] + " cours requis sur 4");
	$("#o6p").text(choice.opts["6p"] + " cours supplémentaires");
	$("#o7").text(choice.opts["7"] + " cours supplémentaires");
};
