const sqlite3 = require('sqlite3');
const fs = require('fs');
const data = require('./data.js');

const professorTable = "CREATE TABLE professors(\
	name TEXT PRIMARY KEY NOT NULL\
)";

const insertProfessor = "INSERT INTO professors VALUES ($name)";

const optionTable = "CREATE TABLE options(\
	name TEXT PRIMARY KEY NOT NULL\
)";

const insertOption = "INSERT INTO options VALUES ($name)";

const courseTable = "CREATE TABLE courses(\
	code TEXT PRIMARY KEY,\
	title TEXT NOT NULL,\
	semester INTEGER,\
	credits INTEGER NOT NULL,\
	comments TEXT\
)";

const insertCourse = "INSERT INTO courses VALUES ($code, $title, $semester,\
	$credits, $comments)";

const teachingTable = "CREATE TABLE teaching(\
	professorName TEXT REFERENCES professors(name),\
	courseCode TEXT REFERENCES courses(code)\
)";

const insertTeaching = "INSERT INTO teaching VALUES ($name, $code)";

const structureTable = "CREATE TABLE structure(\
	optionName TEXT REFERENCES options(name),\
	courseCode TEXT REFERENCES courses(code),\
	isOptional BOOLEAN NOT NULL\
)";

const insertStructure = "INSERT INTO structure VALUES ($name, $code, $isOptional)";

function createDatabase() {
	var db = new sqlite3.Database("courses.db");
	db.serialize(function () {
		db.run(professorTable, function (err) {
			if (err) console.log("Professors table : " + err);
		});
		db.run(optionTable, function (err) {
			if (err) console.log("Options table : " + err);
		});
		db.run(courseTable, function (err) {
			if (err) console.log("Courses table : " + err);
		});
		db.run(teachingTable, function (err) {
			if (err) console.log("Teaching table : " + err);
		});
		db.run(structureTable, function (err) {
			if (err) console.log("Structure table : " + err);
		});

		data.professors.forEach(function (name) {
			db.run(insertProfessor, {$name: name}, function (err) {
				if (err) console.log("Professors table : " + err);
			});
		});

		data.options.forEach(function (name) {
			db.run(insertOption, {$name: name}, function (err) {
				if (err) console.log("Options table : " + err);
			});
		});

		data.courses.forEach(function (course) {
			db.run(insertCourse, {$code: course.code, $title: course.title,
				$semester: course.semester, $credits: course.credits,
				$comments: course.comments}, function (err) {
					if (err) console.log("Courses table : " + err);
				});

			course.professors.forEach(function (name) {
				db.run(insertTeaching, {$name: name, $code: course.code}, function (err) {
					if (err) console.log("Teaching table : " + err);
				})
			});

			course.options.forEach(function (name) {
				if (name.includes("(O)"))
					db.run(insertStructure, {$name: name.substring(0, name.length-4),
						$code: course.code, $isOptional: false}, function (err) {
							if (err) console.log("Structure Table :" + err);
						});
				else db.run(insertStructure, {$name: name,
						$code: course.code, $isOptional: true}, function (err) {
							if (err) console.log("Structure table : " + err);
						});
			});
		});
	});
};

exports.createDatabase = createDatabase;
