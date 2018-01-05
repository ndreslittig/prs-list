var request = require('request');
var async = require('async');
var cheerio = require('cheerio');

var totalNumber = 0;

var urlJson = { 'Haley Anderson': 'http://www.tfrrs.org/athletes/4981212.html',
  'Marinice Bauman': 'http://www.tfrrs.org/athletes/5119098.html',
  'Rebecca Dow': 'http://www.tfrrs.org/athletes/5459776.html',
  'Rebecca Entrekin': 'http://www.tfrrs.org/athletes/5459777.html',
  'Kristin Fairey': 'http://www.tfrrs.org/athletes/5958344.html',
  'Ellen Flood': 'http://www.tfrrs.org/athletes/5958345.html',
  'Erin Gant': 'http://www.tfrrs.org/athletes/4981214.html',
  'Hailey Gollnick': 'http://www.tfrrs.org/athletes/4981215.html',
  'Gabrielle Gusmerotti': 'http://www.tfrrs.org/athletes/5958346.html',
  'Rachel Thorne': 'http://www.tfrrs.org/athletes/4637170.html',
  'Domonique Hall': 'http://www.tfrrs.org/athletes/5119117.html',
  'Brianna Hayden': 'http://www.tfrrs.org/athletes/6079179.html',
  'Angelica Henderson': 'http://www.tfrrs.org/athletes/5119104.html',
  'Anna Hightower': 'http://www.tfrrs.org/athletes/5584572.html',
  'Shannon Innis': 'http://www.tfrrs.org/athletes/5119099.html',
  'Bria Matthews': 'http://www.tfrrs.org/athletes/5584573.html',
  'Alexandra Melehan': 'http://www.tfrrs.org/athletes/5459773.html',
  'Courtney Naser': 'http://www.tfrrs.org/athletes/4981216.html',
  'Ksenia Novikova': 'http://www.tfrrs.org/athletes/5119100.html',
  'Juanita Pardo': 'http://www.tfrrs.org/athletes/5459775.html',
  'Hannah Petit': 'http://www.tfrrs.org/athletes/5958348.html',
  'Brittany Powell': 'http://www.tfrrs.org/athletes/5958351.html',
  'Mary Prouty': 'http://www.tfrrs.org/athletes/5459772.html',
  'Amy Ruiz': 'http://www.tfrrs.org/athletes/5459774.html',
  'Dasia Smith': 'http://www.tfrrs.org/athletes/5584574.html',
  'Mary Claire': 'http://www.tfrrs.org/athletes/5958350.html',
  'Charlotte Stephens': 'http://www.tfrrs.org/athletes/4981217.html',
  'Haley Stumvoll': 'http://www.tfrrs.org/athletes/5459778.html',
  'Lindsey Wheeler': 'http://www.tfrrs.org/athletes/5584575.html',
  'Jeanine Williams': 'http://www.tfrrs.org/athletes/6079182.html',
  'Denise Woode': 'http://www.tfrrs.org/athletes/6079184.html' }


var names = [ "Haley Anderson", "Marinice Bauman", "Rebecca Dow", "Rebecca Entrekin", "Kristin Fairey", "Ellen Flood", "Erin Gant", "Hailey Gollnick", "Gabrielle Gusmerotti", "Dominique Hall", "Brianna Hayden", "Angelica Henderson", "Anna Hightower", "Shannon Innis", "Bria Matthews", "Alexandra Melehan", "Courtney Naser", "Ksenia Novikova", "Juanita Pardo", "Hannah Petit", "Brittany Powell", "Mary Prouty", "Amy Ruiz", "Dasia Smith", "Mary Claire Solomon", "Charlotte Stephens", "Haley Stumvoll", "Lindsey Wheeler", "Jeanine Williams", "Denise Woode" ];

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
	return -69
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
					var time = $(this).find('td').first().text().split('(')[0].trim();
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
	if((""+oldMark).indexOf("m") > -1 && (newMark > oldMark || newMark.length > oldMark.length)) {
		//jump or throw
		out = true;
	} else if((newMark < oldMark && newMark.length == oldMark.length)) {
		//time
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