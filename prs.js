var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var prs = require('./prDataObj');

var totalNumber = 0;

var dudes = { '60m' : '6.88', '200m' : '21.76', '400m' : '48.26', '800m' : '1:51.78',  
				   Mile : '4:09.79',  '3000m' : '8:15.92',  '5000m' : '14:23.54',  '60 Hurdles' : '8.15',  
				   'High Jump' : '2.02m',  'Pole Vault' : '4.85m',  'Long Jump' : '7.02m',  'Triple Jump' : '14.21m',  
				   'Shot Put' : '16.16m',  'Weight Throw' : '17.31m'};

var dudettes = { '60m' : '7.56', '200m' : '24.37', '400m' : '55.05', '800m' : '2:09.82',  
				   Mile : '4:50.91',  '3000m' : '9:31.98',  '5000m' : '16:47.14',  '60 Hurdles' : '8.61',  
				   'High Jump' : '1.69m',  'Pole Vault' : '3.91m',  'Long Jump' : '5.80m',  'Triple Jump' : '12.13m',  
				   'Shot Put' : '13.62m',  'Weight Throw' : '17.34m'};
var standards = { male : dudes, female : dudettes}
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
  'Daniel Pietsch (Emory)': 'https://www.tfrrs.org/athletes/4987910',
  'Daniel Pietsch (GT)': 'https://www.tfrrs.org/athletes/6553544',
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

//output objects
var men = {}
var women = {}
var menrecent = {}
var womenrecent = {}

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

// not used because fuck it, use string comparisons. used for % calcs now
function timeToMillis(string) {
	if(string && string.length > 0) {
		var ms = 0
		local = string
		ms += parseInt(local.split('.').pop());
		local = local.slice(0, -3)
		var rest = local.split(':').reverse();
		currentVal=[1000,60000,3600000]
		for(var i = 0; i < rest.length; i++) {
			ms+=currentVal[i]*parseInt(rest[i])
		}
		return ms;
	} else {
		console.log("offending mark: "+string);
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

var equivalencies = {
	"60" : "60m",
	"200" : "200m",
	"400" : "400m",
	"400" : "400m",
	"600" : "600m",
	"800" : "800m",
	"1000" : "1000m",
	"Mile" : "Mile",
	"3000" : "3000m",
	"5000" : "5000m",
	"60H" : "60 Hurdles",
	"TJ" : "Triple Jump",
	"LJ" : "Long Jump",
	"HJ" : "High Jump",
	"PV" : "Pole Vault",
	"SP" : "Shot Put",
	"WT" : "Weight Throw"
}

var season = "INDOOR";
var meetName = "";
async function compileRecentPerfs(date, gender, name, url) {
	var recentDateString = date;
	var weeksPerformances = []
	return new Promise(resolve => {
		request(url, function (error, response, body) {
			$ = cheerio.load(body);
			meetDate = $('#meet-results').find('table').first().find('thead > tr > th > span').text().trim();
			if(meetDate === recentDateString) {
				 locMeetName = $('#meet-results').find('table').first().find('thead > tr > th > a').text().trim();
				 if(meetName.indexOf(locMeetName) < 0) {
				 	meetName+="/"+locMeetName;
				 } 

				$('#meet-results').find('table').first().find('table > tbody > tr').each(function(index, item) {
					var thisRow = Array.apply(null, Array(7)).map(function () {});
					thisRow[0] = name;
					rawEvent = $(this).find('td').first().text().trim();
					eventName = equivalencies[rawEvent];
					mark = $(this).find('td').eq(1).text().trim();
					if(mark.indexOf('m') > -1) {
						mark = mark.split('m')[0]+'m'; //gross
					} else if(mark.indexOf('\n') > -1) {
						mark = mark.split('\n')[0];
					}
					thisRow[1] = eventName;
					thisRow[2] = mark;
					//TODO adapt to include outdoor and also women
					thisRow[5] = gender === "male" ? prs.menObj[name]["INDOOR"][eventName] : prs.womenObj[name]["INDOOR"][eventName];
					thisRow[3] = standards[gender][eventName];
					if(mark.indexOf("m") > -1) {
						// distance or throw, strip 'm' and parse to int
						thisRow[4] = (parseFloat(mark.replace("m", ""))/parseFloat(thisRow[3].replace("m",""))*100).toFixed(2)+"%";
						thisRow[6] = (parseFloat(mark.replace("m", ""))/parseFloat(thisRow[5].replace("m",""))*100).toFixed(2)+"%";

					} else {
						thisRow[4] = ((timeToMillis(thisRow[3])/timeToMillis(mark))*100).toFixed(2)+"%";
						thisRow[6] = ((timeToMillis(thisRow[5])/timeToMillis(mark))*100).toFixed(2)+"%";
					}
					weeksPerformances.push(thisRow);
				});
				resolve(weeksPerformances);
			} else {
				//did not compete
				resolve([]);
			}
		});
	});	
}
// async function compileRecentPerfsForCSV(date, name, url) {
// 	var recentDateString = date;
// 	var weeksPerformances = []
// 	return new Promise(resolve => {
// 		request(url, function (error, response, body) {
// 			$ = cheerio.load(body);
// 			meetDate = $('#meet-results').find('table').first().find('thead > tr > th > span').text().trim();
// 			if(meetDate === recentDateString) {
// 				 locMeetName = $('#meet-results').find('table').first().find('thead > tr > th > a').text().trim();
// 				 if(meetName.indexOf(locMeetName) < 0 && meetName.length > 0) {
// 				 	meetName+="/"+locMeetName;
// 				 } else {
// 				 	meetName = locMeetName;
// 				 }

// 				$('#meet-results').find('table').first().find('table > tbody > tr').each(function(index, item) {
// 					var thisRow = {"name" : name};
// 					rawEvent = $(this).find('td').first().text().trim();
// 					eventName = equivalencies[rawEvent];
// 					mark = $(this).find('td').eq(1).text().trim();
// 					if(mark.indexOf('m') > -1) {
// 						mark = mark.split('m')[0]+'m'; //gross
// 					} else if(mark.indexOf('\n') > -1) {
// 						mark = mark.split('\n')[0];
// 					}
// 					thisRow["event"] = eventName;
// 					thisRow["mark"] = mark;
// 					//TODO adapt to include outdoor
// 					thisRow["PR"] = prs.team[name]["INDOOR"][eventName];
// 					thisRow["ACC Q"] = prs.standards[eventName];
// 					if(mark.indexOf("m") > -1) {
// 						// distance or throw, strip 'm' and parse to int
// 						thisRow["% of ACC Q"] = (parseFloat(mark.replace("m", ""))/parseFloat(thisRow["ACC Q"].replace("m","")))+"%";
// 						thisRow["% of PR"] = (parseFloat(mark.replace("m", ""))/parseFloat(thisRow["PR"].replace("m","")))+"%";

// 					} else {
// 						thisRow["% of ACC Q"] = ((timeToMillis(thisRow["ACC Q"])/timeToMillis(mark))*100)+"%";
// 						thisRow["% of PR"] = ((timeToMillis(thisRow["PR"])/timeToMillis(mark))*100)+"%";
// 					}
// 					weeksPerformances.push(thisRow);
// 				});
// 				resolve(weeksPerformances);
// 			} else {
// 				//did not compete
// 				resolve({"name" : "DNC"});
// 			}
// 		});
// 	});	
// }

//code for new TFRRS
async function compilePRsNew(url, gender) {
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
							if(year === '2018' && isNewPR(standards[gender][eventName], time)) {
								if(indoorPRs["ACC_"+eventName] === undefined || isNewPR(indoorPRs["ACC_"+eventName], time)) {
									indoorPRs["ACC_"+eventName] = time
								}
							}
						} else {
							if( outdoorPRs[eventName] === undefined || isNewPR(outdoorPRs[eventName], time) ) {
								outdoorPRs[eventName] = time;
							}
							if(year === '2018' && isNewPR(prs.standards[gender][eventName], time)) {
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
		nmc = parseFloat(newMark.replace("m",""));
		omc = parseFloat(oldMark.replace("m",""));
		out = (nmc > omc);
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
			await compilePRsNew(url, gender);
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
	return parent;
}

async function getRecentPerfsAsJSON(date, gender) {
	var outputObj = { meetName : "",
					  meetDate : date,
					 tableData : [] }
	names = (gender==="male") ? Object.keys(urlJson) : Object.keys(gurlJson);
	var numNames = 0;
	for(var i = 0; i < names.length; i++) {
		var url = (gender==="male") ? urlJson[names[i]] : gurlJson[names[i]];
		if(url.length > 5) {
			try {
			   let result = await compileRecentPerfs(date, gender, names[i], url);
			   for(var j = 0; j < result.length; j++) {
			   		outputObj.tableData.push(result[j]);
			   }
			   numNames++;
			} catch(err) {
			    console.log(err);
			}	
		}
		console.log(numNames+"/"+names.length+" processed")
	}
	outputObj.meetName = meetName.slice(1);
	return outputObj;
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

//generateRecentPerfsToFile
async function generateRecentPerfsToFile() {
	try {
	   console.log("MEN");
	   let menrecent = await getRecentPerfsAsJSON("Jan 19-20, 2018", "male");
	   var menJsonString = "var menObj="+JSON.stringify(menrecent)+";";
	} catch(err) {
	    console.log(err);
	}
	try {
	   console.log("WOMEN");
	   let womenrecent = await getRecentPerfsAsJSON("Jan 19-20, 2018", "female");
	   var womenJsonString = "var womenObj="+JSON.stringify(womenrecent)+";";
	} catch(err) {
	    console.log(err);
	}
	var fullBlob = menJsonString+"\n"+womenJsonString;
	var fs = require('fs');
	fs.writeFile('recentDataObj.js', fullBlob, 'utf8', function(){
		console.log("File successfully written.")
	});
}

async function generatePRsToFile() {
	try {
	   let men = await getAllPRsAsJSON("male");
	   var menJsonString = "var menObj="+JSON.stringify(men)+";";
	} catch(err) {
	    console.log(err);
	}
	try {
	   let women = await getAllPRsAsJSON("female");
	   var womenJsonString = "var womenObj="+JSON.stringify(women)+";";
	} catch(err) {
	    console.log(err);
	}
	var fullBlob = menJsonString+"\n"+womenJsonString;
	fullBlob+='exports.menObj=menObj;\nexports.womenObj=womenObj;'
	var fs = require('fs');
	fs.writeFile('prDataObj.js', fullBlob, 'utf8', function(){
		console.log("File successfully written.")
	});
}

async function recentPerfs() {
	try {
	   let recentPerfs = await compileRecentPerfs('Tyson Spears', 'http://www.tfrrs.org/athletes/6087515');
	   console.log(result);
	} catch(err) {
	    console.log(err);
	}
}

// generate PR json
//getRecentPerfsAsJSON("Jan 19-20, 2018", "male");
//generateRecentPerfsToFile();
generatePRsToFile();


// generate diff between saved prObject.js and current TFRRS data (determine who PRed from last week)
//checkAndReport();

// generate urlJson above
//getAllURLs();