$(document).ready(function () {
	$("#table").load('/all');
	$("#name").text("");
	$("#nameProf").text("");
	$("#nameOpt").text("");
	calculateCredits();
	if (document.cookie) from();
	showAll();
});

function showAll() {
	$("#table").load('/all', function () {
		selected.forEach(function (course) {
			if (course.removed) return;
			$("#"+course.code).addClass("success");
		});
	});
	$("#name").text("");
	$("#nameProf").text("");
	$("#nameOpt").text("");
}

function filterProf(prof) {
	var query = '/professor/'+prof.replace(/ /g, "%20");
	$("#table").load(query, function () {
		selected.forEach(function (course) {
			if (course.removed) return;
			$("#"+course.code).addClass("success");
		});
	});
	$("#name").text(" > " + prof);
	$("#nameProf").text(prof);
	$("#nameOpt").text("");
};

function filterOpt(opt) {
	var query = '/option/'+opt.replace(/ /g, "%20");
	$("#table").load(query, function () {
		selected.forEach(function (course) {
			if (course.removed) return;
			$("#"+course.code).addClass("success");
		});
	});
	$("#name").text(" > " + opt);
	$("#nameProf").text("");
	$("#nameOpt").text(opt);
};

function reset() {
	if (confirm("Êtes-vous sûr ?")) {
		selected = [];
		courses.forEach(function (course) {
			$("#"+course.code).removeClass("success");
		});
	}
	calculateCredits();
};

function save() {
	var d = new Date();
	d.setTime(d.getTime() + (30*24*60*60*1000)); // 1 month
	var expires = "expires="+ d.toUTCString();
	var selection = "";
	selected.forEach(function (course) {
		selection += "(" + course.code + ":" + course.year + "),"
	});
	document.cookie = "selected" + "=" + selection.substring(0,selection.length-1) + ";" + expires + ";path=/";
};

function from() {
	var name = "selected" + "=";
	var cookie = decodeURIComponent(document.cookie);
	var selection = cookie.substring(name.length, cookie.length);
	selection.split(',').forEach(function (sel) {
		var select = sel.split(':');
		addOrRemove(select[0].substring(1), select[1].substring(0,select[1].length-1))
	});
	calculateCredits();
};

function addOrRemove(code, year) {
	var hasBeenFound = false;
	selected.forEach(function (course) {
		if (course.code === code && course.removed === false) {
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
	var q1 = 0, q2 = 0, q3 = 0, q4 = 0;
	var q1Courses = [], q2Courses = [], q3Courses = [], q4Courses = [];
	var q1List = "", q2List = "", q3List = "", q4List = "";
	var opts = {"1" : 0, "2" : 0, "3" : 0, "3p" : 0, "4" : 0, "4p" : 0,
				"5" : 0, "5p" : 0, "6" : 0, "6p" : 0, "7" : 0};
	courses.forEach(function (course) {
		$("#"+course.code).removeClass("success");
	});
	selected.forEach(function (course) {
		if (course.removed) return;
		$("#"+course.code).addClass("success");
		course.desc = "<strong>[" + course.code + "]</strong> " + course.title;
		if (course.year === 1) {
			if (course.semester === 1) {
				q1 += course.credits;
				q1Courses.push(course.desc);
			} else if (course.semester === 2) {
				q2 += course.credits;
				q2Courses.push(course.desc);
			} else {
				q1 += course.credits / 2;
				q2 += course.credits / 2;
				q1Courses.push(course.desc);
				q2Courses.push(course.desc);
			}
		} else {
			if (course.semester === 1) {
				q3 += course.credits;
				q3Courses.push(course.desc);
			} else if (course.semester === 2) {
				q4 += course.credits;
				q4Courses.push(course.desc);
			} else {
				q3 += course.credits / 2;
				q4 += course.credits / 2;
				q3Courses.push(course.desc);
				q4Courses.push(course.desc);
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
	var o1 = "<strong>" + opts["1"] + "</strong> cours requis sur 4";
	var o2 = "<strong>" + opts["2"] + "</strong> cours requis sur 5";
	var o3 = "<strong>" + opts["3"] + "</strong> cours requis sur 4";
	var o3p = "<strong>" + opts["3p"] + "</strong> cours supplémentaires";
	var o4 = "<strong>" + opts["4"] + "</strong> cours requis sur 4";
	var o4p = "<strong>" + opts["4p"] + "</strong> cours supplémentaires";
	var o5 = "<strong>" + opts["5"] + "</strong> cours requis sur 4";
	var o5p = "<strong>" + opts["5p"] + "</strong> cours supplémentaires";
	var o6 = "<strong>" + opts["6"] + "</strong> cours requis sur 4";
	var o6p = "<strong>" + opts["6p"] + "</strong> cours supplémentaires";
	var o7 = "<strong>" + opts["7"] + "</strong> cours supplémentaires";
	q1Courses.forEach(function (course) {
		q1List += "<li>" + course + "</li>";
	});
	q2Courses.forEach(function (course) {
		q2List += "<li>" + course + "</li>";
	});
	q3Courses.forEach(function (course) {
		q3List += "<li>" + course + "</li>";
	});
	q4Courses.forEach(function (course) {
		q4List += "<li>" + course + "</li>";
	});
	populateHTML({
		q1: q1, q2: q2, q3: q3, q4: q4,
		o1: o1, o2: o2, o3: o3, o3p: o3p,
		o4: o4, o4p: o4p, o5: o5, o5p: o5p,
		o6: o6, o6p: o6p, o7: o7,
		q1List: q1List, q2List: q2List,
		q3List: q3List, q4List: q4List
	});
};

function populateHTML(info) {
	$("#total").html(info.q1 + info.q2 + info.q3 + info.q4);
	$("#total2").html(info.q1 + info.q2 + info.q3 + info.q4);
	$("#q1").html(info.q1);
	$("#q2").html(info.q2);
	$("#q3").html(info.q3);
	$("#q4").html(info.q4);
	$("#o1").html(info.o1);
	$("#o2").html(info.o2);
	$("#o3").html(info.o3);
	$("#o3p").html(info.o3p);
	$("#o4").html(info.o4);
	$("#o4p").html(info.o4p);
	$("#o5").html(info.o5);
	$("#o5p").html(info.o5p);
	$("#o6").html(info.o6);
	$("#o6p").html(info.o6p);
	$("#o7").html(info.o7);
	$("#q1Courses").html(info.q1List);
	$("#q2Courses").html(info.q2List);
	$("#q3Courses").html(info.q3List);
	$("#q4Courses").html(info.q4List);
};
