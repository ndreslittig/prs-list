var request = require('request');
var async = require('async');
var cheerio = require('cheerio');

var totalNumber = 0;

var urlJson = { 'William Solomon': 'http://www.tfrrs.org/athletes/5124533.html'}

var urlJson2 = {   'Avery Bartlett': 'http://www.tfrrs.org/athletes/5459790.html',
				  'Christian Bowles': 'http://www.tfrrs.org/athletes/5459792.html',
				  'Anthony Brooks': '',
				  'Braeden Collins': 'http://www.tfrrs.org/athletes/6423527.html',
				  'Sam Costa': 'http://www.tfrrs.org/athletes/5958354.html',
				  'Gabriel Darosa': 'http://www.tfrrs.org/athletes/4981192.html',
				  'Patrick Fleming': 'http://www.tfrrs.org/athletes/4509076.html',
				  'Jag Gangemi': 'http://www.tfrrs.org/athletes/4509077.html',
				  'Alex Grady': 'http://www.tfrrs.org/athletes/4509078.html',
				  'Bennett Hillier': 'http://www.tfrrs.org/athletes/5958355.html',
				  'Ben Jean': 'http://www.tfrrs.org/athletes/6087513.html',
				  'Lionel Jones': 'http://www.tfrrs.org/athletes/5587168.html',
				  'Andrew Kent': 'http://www.tfrrs.org/athletes/5958356.html',
				  'Mark Kimura-Smith': '',
				  'Andres Littig': 'http://www.tfrrs.org/athletes/4509083.html',
				  'John Lyons': 'http://www.tfrrs.org/athletes/5958357.html',
				  'Hunter Mallard': '',
				  'Andrew Matson': 'http://www.tfrrs.org/athletes/5958358.html',
				  'Eamon Mccoy': 'http://www.tfrrs.org/athletes/5459791.html',
				  'Ryan Miller': 'http://www.tfrrs.org/athletes/4981194.html',
				  'Matt Munns': 'http://www.tfrrs.org/athletes/4981196.html',
				  'Ryan Peck': 'http://www.tfrrs.org/athletes/5459796.html',
				  'Isaac Penman': 'http://www.tfrrs.org/athletes/5459795.html',
				  'Daniel Pietsch': 'https://www.tfrrs.org/athletes/4987910.html',
				  'Frank Pittman': 'http://www.tfrrs.org/athletes/5958359.html',
				  'Michael Reilly': 'http://www.tfrrs.org/athletes/5958360.html',
				  'Mitchell Sanders': 'http://www.tfrrs.org/athletes/5459794.html',
				  'Tanner Shaw': 'http://www.tfrrs.org/athletes/4981197.html',
				  'Maurice Simpson': 'http://www.tfrrs.org/athletes/6087514.html',
				  'Preston Smith': 'http://www.tfrrs.org/athletes/5124532.html',
				  'Nahom Solomon': 'http://www.tfrrs.org/athletes/4981198.html',
				  'William Solomon': 'http://www.tfrrs.org/athletes/5124533.html',
				  'Tyson Spears': 'http://www.tfrrs.org/athletes/6087515.html',
				  'Anthony Steets': '',
				  'Brandon Stone': '',
				  'Corson Teasley': 'http://www.tfrrs.org/athletes/5958361.html',
				  'Ryan Thomas': 'http://www.tfrrs.org/athletes/5124534.html',
				  'Andreas Ward': 'http://www.tfrrs.org/athletes/5124536.html',
				  'Dwayne Watkins': 'http://www.tfrrs.org/athletes/6087516.html',
				  'Wesley Watkins': '',
				  'Tyler Whorton': 'http://www.tfrrs.org/athletes/6423528.html' 
				}

var names = ["Avery Bartlett", "Christian Bowles", "Anthony Brooks", "Braeden Collins", 
				 "Sam Costa", "Gabriel Darosa", "Patrick Fleming", "Jag Gangemi", "Alex Grady", 
				 "Bennett Hillier", "Ben Jean", "Lionel Jones", "Andrew Kent", "Mark Kimura-Smith", 
				 "Andres Littig", "John Lyons", "Hunter Mallard", "Andrew Matson", "Eamon Mccoy", 
				 "Ryan Miller", "Matt Munns", "Ryan Peck", "Isaac Penman", "Daniel Pietsch", 
				 "Frank Pittman", "Michael Reilly", "Mitchell Sanders", "Tanner Shaw", "Maurice Simpson", 
				 "Preston Smith", "Nahom Solomon", "William Solomon", "Tyson Spears", "Anthony Steets", 
				 "Brandon Stone", "Corson Teasley", "Ryan Thomas", "Andreas Ward", "Dwayne Watkins", 
				 "Wesley Watkins", "Tyler Whorton"];

var urlObject = {}
var indoorPRs = {}
var outdoorPRs = {}

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
async function compilePRs(url) {
	return new Promise(resolve => {
		request(url, function (error, response, body) {
			$ = cheerio.load(body);
				$('.panel-second-title').find('.title > table > tbody').first().find('td').slice(3).each(function(index, item) {	
					indoorPRs[$(this).text().trim()] = -1
					outdoorPRs[$(this).text().trim()] = -1
				});
				tdata = $('.topperformances').find('.data > table > tbody').first().find('tr').each(function(index, item) {
					var keys = Object.keys(indoorPRs);
					season = $(this).find('td').eq(1).text()
					seasonText = $(this).find('td').text()
					$(this).find('td').slice(3).each(function(index, item) {
						var current = $(this).text().replace('-- --','').trim();
						if(current.length > 1) {	 
							if(season.indexOf('Indoor') > -1) {
								if( isNewPR(indoorPRs[keys[index]], current) ) {
									indoorPRs[keys[index]] = current;
								}
							} else {
								if( isNewPR(outdoorPRs[keys[index]], current) ) {
									outdoorPRs[keys[index]] = current;
								}
							}
						}
					});
				});
			resolve("done");
		});
	});	
}

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
						} else {
							if( outdoorPRs[eventName] === undefined || isNewPR(outdoorPRs[eventName], time) ) {
								outdoorPRs[eventName] = time;
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
	console.log("old mark: "+oldMark+", new mark: "+newMark+", newMark > oldMark: "+(newMark > oldMark))

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

async function getAllPRsAsJSON() {
	var parent = {}
	names = Object.keys(urlJson);
	var numNames = 0;
	for(var i = 0; i < names.length; i++) {
		var url = urlJson[names[i]];
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

getAllPRsAsJSON();
//getAllURLs();