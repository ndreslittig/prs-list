var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var prs = require('./prObject');

var totalNumber = 0;
//generated from 'names' by below code
var urlJson = { 'Avery Bartlett': 'http://www.tfrrs.org/athletes/5459790',
  'Christian Bowles': 'http://www.tfrrs.org/athletes/5459792',
  'Anthony Brooks': 'http://www.tfrrs.org/athletes/6553541',
  'Braeden Collins': 'http://www.tfrrs.org/athletes/6423527',
  'Sam Costa': 'http://www.tfrrs.org/athletes/5958354',
  'Gabriel Darosa': 'http://www.tfrrs.org/athletes/4981192',
  'Patrick Fleming': 'http://www.tfrrs.org/athletes/4509076',
  'Jag Gangemi': 'http://www.tfrrs.org/athletes/4509077',
  'Alex Grady': 'http://www.tfrrs.org/athletes/4509078',
  'Bennett Hillier': 'http://www.tfrrs.org/athletes/5958355',
  'Ben Jean': 'http://www.tfrrs.org/athletes/6087513',
  'Lionel Jones': 'http://www.tfrrs.org/athletes/5587168',
  'Andrew Kent': 'http://www.tfrrs.org/athletes/5958356',
  'Mark Kimura-Smith': '',
  'Andres Littig': 'http://www.tfrrs.org/athletes/4509083',
  'John Lyons': 'http://www.tfrrs.org/athletes/5958357',
  'Hunter Mallard': 'http://www.tfrrs.org/athletes/6553543',
  'Andrew Matson': 'http://www.tfrrs.org/athletes/5958358',
  'Matt McBrien': 'https://www.tfrrs.org/athletes/5459793',
  'Eamon Mccoy': 'http://www.tfrrs.org/athletes/5459791',
  'Ryan Miller': 'http://www.tfrrs.org/athletes/4981194',
  'Matt Munns': 'http://www.tfrrs.org/athletes/4981196',
  'Ryan Peck': 'http://www.tfrrs.org/athletes/5459796',
  'Isaac Penman': 'http://www.tfrrs.org/athletes/5459795',
  'Daniel Pietsch': 'http://www.tfrrs.org/athletes/6553544',
  'Frank Pittman': 'http://www.tfrrs.org/athletes/5958359',
  'Michael Reilly': 'http://www.tfrrs.org/athletes/5958360',
  'Mitchell Sanders': 'http://www.tfrrs.org/athletes/5459794',
  'Tanner Shaw': 'http://www.tfrrs.org/athletes/4981197',
  'Maurice Simpson': 'http://www.tfrrs.org/athletes/6087514',
  'Preston Smith': 'http://www.tfrrs.org/athletes/5124532',
  'Nahom Solomon': 'http://www.tfrrs.org/athletes/4981198',
  'William Solomon': 'http://www.tfrrs.org/athletes/5124533',
  'Tyson Spears': 'http://www.tfrrs.org/athletes/6087515',
  'Anthony Steets': 'http://www.tfrrs.org/athletes/6553545',
  'Brandon Stone': 'http://www.tfrrs.org/athletes/6553546',
  'Corson Teasley': 'http://www.tfrrs.org/athletes/5958361',
  'Ryan Thomas': 'http://www.tfrrs.org/athletes/5124534',
  'Andreas Ward': 'http://www.tfrrs.org/athletes/5124536',
  'Dwayne Watkins': 'http://www.tfrrs.org/athletes/6087516',
  'Wesley Watkins': 'http://www.tfrrs.org/athletes/6553547',
  'William White': 'https://www.tfrrs.org/athletes/6574749',
  'Tyler Whorton': 'http://www.tfrrs.org/athletes/6423528' }

var gurlJson = { 'Haley Anderson': 'http://www.tfrrs.org/athletes/4981212',
  'Marinice Bauman': 'http://www.tfrrs.org/athletes/5119098',
  'Rebecca Dow': 'http://www.tfrrs.org/athletes/5459776',
  'Kendria Edouard': 'http://www.tfrrs.org/athletes/6423489',
  'Kenya Collins': 'http://www.tfrrs.org/athletes/5152685',
  'Rebecca Entrekin': 'http://www.tfrrs.org/athletes/5459777',
  'Kristin Fairey': 'http://www.tfrrs.org/athletes/5958344',
  'Nicole Fegans': 'http://www.tfrrs.org/athletes/6423485',
  'Ellen Flood': 'http://www.tfrrs.org/athletes/5958345',
  'Samantha Folio': 'http://www.tfrrs.org/athletes/6423487',
  'Ebony Forbes': 'http://www.tfrrs.org/athletes/6529088',
  'Liz Galarza': 'http://www.tfrrs.org/athletes/6423486',
  'Erin Gant': 'http://www.tfrrs.org/athletes/4981214',
  'Hailey Gollnick': 'http://www.tfrrs.org/athletes/4981215',
  'Gabrielle Gusmerotti': 'http://www.tfrrs.org/athletes/5958346',
  'Domonique Hall': 'https://www.tfrrs.org/athletes/5119117.html',
  'Madeline Hammond': 'http://www.tfrrs.org/athletes/6529086',
  'Brianna Hayden': 'http://www.tfrrs.org/athletes/6079179',
  'Angelica Henderson': 'http://www.tfrrs.org/athletes/5119104',
  'Anna Hightower': 'http://www.tfrrs.org/athletes/5584572',
  'Shannon Innis': 'http://www.tfrrs.org/athletes/5119099',
  'Bria Matthews': 'http://www.tfrrs.org/athletes/5584573',
  'Alexandra Melehan': 'http://www.tfrrs.org/athletes/5459773',
  'Courtney Naser': 'http://www.tfrrs.org/athletes/4981216',
  'Kendall Nelson': 'http://www.tfrrs.org/athletes/6423490',
  'Ksenia Novikova': 'http://www.tfrrs.org/athletes/5119100',
  'Pharist O\'Neal': 'https://www.tfrrs.org/athletes/6529087.html',
  'Juanita Pardo': 'http://www.tfrrs.org/athletes/5459775',
  'Hannah Petit': 'http://www.tfrrs.org/athletes/5958348',
  'Brittany Powell': 'http://www.tfrrs.org/athletes/5958351',
  'Mary Prouty': 'http://www.tfrrs.org/athletes/5459772',
  'Marie Repasy': 'http://www.tfrrs.org/athletes/6423491',
  'Amy Ruiz': 'http://www.tfrrs.org/athletes/5459774',
  'Dasia Smith': 'http://www.tfrrs.org/athletes/5584574',
  'Mary Claire Solomon': 'https://www.tfrrs.org/athletes/5958350.html',
  'Charlotte Stephens': 'http://www.tfrrs.org/athletes/4981217',
  'Raven Stewart': 'http://www.tfrrs.org/athletes/5647987',
  'Haley Stumvoll': 'http://www.tfrrs.org/athletes/5459778',
  'Rachel Thorne': 'https://www.tfrrs.org/athletes/4637170',
  'Lindsey Wheeler': 'http://www.tfrrs.org/athletes/5584575',
  'Jeanine Williams': 'http://www.tfrrs.org/athletes/6079182',
  'Denise Woode': 'http://www.tfrrs.org/athletes/6079184',
  'Nicole Zaubi': 'http://www.tfrrs.org/athletes/6423499' }

var names = ["Avery Bartlett", "Christian Bowles", "Anthony Brooks", "Braeden Collins", 
				 "Sam Costa", "Gabriel Darosa", "Patrick Fleming", "Jag Gangemi", "Alex Grady", 
				 "Bennett Hillier", "Ben Jean", "Lionel Jones", "Andrew Kent", "Mark Kimura-Smith", 
				 "Andres Littig", "John Lyons", "Hunter Mallard", "Andrew Matson", "Eamon Mccoy", 
				 "Ryan Miller", "Matt Munns", "Ryan Peck", "Isaac Penman", "Daniel Pietsch", 
				 "Frank Pittman", "Michael Reilly", "Mitchell Sanders", "Tanner Shaw", "Maurice Simpson", 
				 "Preston Smith", "Nahom Solomon", "William Solomon", "Tyson Spears", "Anthony Steets", 
				 "Brandon Stone", "Corson Teasley", "Ryan Thomas", "Andreas Ward", "Dwayne Watkins", 
				 "Wesley Watkins", "William White", "Tyler Whorton"];

var urlObject = {}
var indoorPRs = {}
var outdoorPRs = {}
var parent = {}

var learningExperiences = ["DNF", "ND", "FOUL", "NH"]

async function processNames() {
	for(var i = 0; i < names.length; i++) {
		//console.log(names[i]);
		var namez = names[i].split(" ");
		await findGTAthlete(namez[0], namez[1]);
		totalNumber++;
		console.log(totalNumber+"/"+names.length+" processed")
	}
}

async function findGTAthlete(firstname, lastname) {
	var $ = null;
	return new Promise(resolve => {
		request.post({url:"https://www.tfrrs.org/site_search.html", form: {athlete: firstname+" "+lastname}} ,function (error, response, body) {
	  		$ = cheerio.load(body);
	  		searchResults = $('.table-striped > tbody').find('tr').filter(function(index, item) {
	  			return ($(this).text().indexOf("Georgia Tech") > -1)
	  		});
	  		if(searchResults.html() != null) {
	  			searchResults.each(function(index, element) {
		  			var stub = "http://www.tfrrs.org";
		  			urlObject[firstname+" "+lastname] = stub+$(this).children().first().html().trim().match('\/athletes\/[0-9]+')[0];
		  			resolve("Done");
		  		});
	  		} else {
	  			resolve("Not found");
	  			urlObject[firstname+" "+lastname] = "";
	  		}
		});
	});
		
}

// not used because fuck it, use string comparisons
function timeToMillis(string) {
	if(string > 0) {
		var ms = 0
		local = string
		console.log("String: "+ string)
		ms += parseInt(local.split('.').pop());
		local = local.slice(0, -3)
		var rest = local.split(':').reverse();
		currentVal=[1000,60000,3600000]
		for(var i = 0; i < rest.length; i++) {
			ms+=currentVal[i]*parseInt(rest[i])
		}
		return ms;
	} else {
		console.log("offending mark: ")+string
	}
	return -69;
}

function timeFromMillis(ms) {
    return new Date(ms).toISOString().slice(11, -1);
}

// code for old TFRRS
// async function compilePRs(url) {
// 	return new Promise(resolve => {
// 		request(url, function (error, response, body) {
// 			$ = cheerio.load(body);
// 				$('.panel-second-title').find('.title > table > tbody').first().find('td').slice(3).each(function(index, item) {	
// 					indoorPRs[$(this).text().trim()] = -1
// 					outdoorPRs[$(this).text().trim()] = -1
// 				});
// 				tdata = $('.topperformances').find('.data > table > tbody').first().find('tr').each(function(index, item) {
// 					var keys = Object.keys(indoorPRs);
// 					season = $(this).find('td').eq(1).text()
// 					console.log(season)
// 					seasonText = $(this).find('td').text()
// 					$(this).find('td').slice(3).each(function(index, item) {
// 						var current = $(this).text().replace('-- --','').trim();
// 						if(current.length > 1) {	 
// 							if(season.indexOf('Indoor') > -1) {
// 								if( isNewPR(indoorPRs[keys[index]], current) ) {
// 									indoorPRs[keys[index]] = current;
// 								}
// 							} else {
// 								if( isNewPR(outdoorPRs[keys[index]], current) ) {
// 									outdoorPRs[keys[index]] = current;
// 								}
// 							}
// 						}
// 					});
// 				});
// 			resolve("done");
// 		});
// 	});	
// }

//code for new TFRRS
async function compilePRsNew(url) {
	return new Promise(resolve => {
		request(url, function (error, response, body) {
			$ = cheerio.load(body);
			$('#event-history').find('table').each(function(index, item) {
				var rawEvent = $(this).find('thead > tr > th').text().trim();
				var eventName = rawEvent.split('(')[0].trim().replace(" Meters", "m").replace("k", "k (XC)");
				$(this).find('tbody > tr').each(function(index, item) {
					var time = $(this).find('td').first().text().trim();
					var year = ($(this).find('td').last().text().trim().split(" ").slice(-1)[0]);
					if(!learningExperiences.includes(time)) { //oops
						if(time.indexOf('m') > -1) {
							time = time.split('m')[0]+'m'; //gross
						} else if(time.indexOf('\n') > -1) {
							time = time.split('\n')[0];
						}
						if(rawEvent.indexOf("Indoor") > -1) {
							if( indoorPRs[eventName] === undefined || isNewPR(indoorPRs[eventName], time) ) {
								indoorPRs[eventName] = time;
							}
							if(year === '2018' && isNewPR(prs.standards[eventName], time)) {
								if(indoorPRs["ACC_"+eventName] === undefined || isNewPR(indoorPRs["ACC_"+eventName], time)) {
									indoorPRs["ACC_"+eventName] = time
								}
							}
						} else {
							if( outdoorPRs[eventName] === undefined || isNewPR(outdoorPRs[eventName], time) ) {
								outdoorPRs[eventName] = time;
							}
							if(year === '2018' && isNewPR(prs.standards[eventName], time)) {
								if(outdoorPRs["ACC_"+eventName] === undefined || isNewPR(outdoorPRs["ACC_"+eventName], time)) {
									outdoorPRs["ACC_"+eventName] = time
								}
							}
						}
					}
				});
			});
			resolve("done");
		});
	});	
}

function isNewPR(oldMark, newMark) {
	var out = false;

	if((newMark).indexOf("m") > -1) {
		out = (newMark > oldMark || newMark.length > oldMark.length);
	} else if((newMark < oldMark && newMark.length == oldMark.length)) {
		out = true;
	}
	return out
}

async function getAllURLs() {
	console.log("Generating URL JSON blob");
	await processNames();
	console.log(urlObject)
}

async function getAllPRs() {
	names = Object.keys(urlJson);
	for(var i = 0; i < names.length; i++) {
		console.log('\n\n')
		console.log(names[i]);
		var url = urlJson[names[i]];
		if(url.length > 5) {
			await compilePRs(url);
		}
	}
}

async function getAllPRsAsJSON(gender) {
	parent = {}
	names = (gender==="male") ? Object.keys(urlJson) : Object.keys(gurlJson);
	var numNames = 0;
	for(var i = 0; i < names.length; i++) {
		var url = (gender==="male") ? urlJson[names[i]] : gurlJson[names[i]];
		if(url.length > 5) {
			await compilePRsNew(url);
			numNames++;
			var prs = {}
			prs['INDOOR'] = indoorPRs
			prs['OUTDOOR'] = outdoorPRs
			parent[names[i]] = prs
			indoorPRs = {}
			outdoorPRs = {}
		}
		console.log(numNames+"/"+names.length+" processed")
	}
	console.log(parent);
}

function checkForNewPRs() {
	var groupMeOutput = "Shouts out to ";
	var ns = Object.keys(prs.team);
	for(var i = 0; i < ns.length; i++) {
		var seasons = Object.keys(prs.team[ns[i]]);
		for(var j = 0; j < seasons.length; j++) {
			var events = Object.keys(parent[ns[i]][seasons[j]]);
			for(var k = 0; k < events.length; k++) {
				if(parent[ns[i]][seasons[j]][events[k]] < prs.team[ns[i]][seasons[j]][events[k]]) {
					groupMeOutput+= ns[i]+" - "+events[k]+": "+parent[ns[i]][seasons[j]][events[k]]+" (was "+prs.team[ns[i]][seasons[j]][events[k]]+"), ";
				}
			}
		}
	}
	return groupMeOutput.slice(0,-2);
}

async function checkAndReport() {
	await getAllPRsAsJSON("male");
	console.log(checkForNewPRs());
}

// generate PR json
getAllPRsAsJSON("male");

// generate diff between saved prObject.js and current TFRRS data (determine who PRed from last week)
//checkAndReport();

// generate urlJson above
//getAllURLs();