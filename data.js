const fs = require('fs');

var professors = [
	"Axel Gosseries",
	"Maxime Lambrecht",
	"Caroline Klein",
	"Ann Rinder",
	"Charles Pecheur",
	"Christophe De Vleeschouwer",
	"Laurent Jacques",
	"Damien Leroy",
	"Dominique Martens",
	"François Glineur",
	"François Koeune",
	"Olivier Pereira",
	"Gildas Avoine",
	"Hans Ausloos",
	"Isabelle Demeulenaere",
	"Mariken Smit",
	"Jean Vanderdonckt",
	"Jean-Charles Delvenne",
	"Gautier Krings",
	"Julien Hendrickx",
	"Jean-Didier Legat",
	"Jean-Pierre Raskin",
	"Jérôme Louveaux",
	"John Cultiaux",
	"John Lee",
	"Michel Verleysen",
	"Kim Mens",
	"Marcela Lobo Bustamante",
	"Marco Saerens",
	"Olivier Bonaventure",
	"Paula Lorente Fernandez",
	"Peter Van Roy",
	"Philippe Chevalier",
	"Pierre Dupont",
	"Cédrick Fairon",
	"Michel Ghislain",
	"Pierre Schaus",
	"Pierre-Antoine Absil",
	"Anthony Papavasiliou",
	"Piotr Sobieski",
	"Vincent Wertz",
	"Ramin Sadre",
	"Siegfried Nijssen",
	"Vincent Blondel",
	"Vincent Legat",
	"Jean-François Remacle",
	"Yves Deville",
	"Bernard Geubelle",
	"Christophe Lecoutre"
];

var options = [
	"Tronc commun",
	"Finalité spécialisée",
	"Intelligence artificielle",
	"Ingénierie logicielle",
	"Sécurité et réseaux",
	"Autres"
];

var courses = new Array();

var data = fs.readFileSync("./MasterChoice.csv", 'utf8');

data.trim().split('\n').forEach(function (course, index) {
	if (index == 0) return;
	var fields = course.split(';');
	courses[index-1] = {
		code : fields[0],
		title : fields[1],
		professors : fields[2].split(','),
		options : fields[3].split(','),
		semester : fields[4],
		credits : fields[5],
		comments : fields[6]
	};
});

module.exports = {
	professors : professors,
	options : options,
	courses : courses
};
