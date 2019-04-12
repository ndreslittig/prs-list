var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var prs = require('./prDataObj');

var totalNumber = 0;

var mensUrl = "https://www.tfrrs.org/teams/GA_college_m_Georgia_Tech.html"
var womensUrl = "https://www.tfrrs.org/teams/GA_college_f_Georgia_Tech.html"

// acc standards

var indudes = { '60m' : '6.88', '200m' : '21.76', '400m' : '48.26', '800m' : '1:51.78',
				   Mile : '4:09.79',  '3000m' : '8:15.92',  '5000m' : '14:23.54',  '60 Hurdles' : '8.15',
				   'High Jump' : '2.02m',  'Pole Vault' : '4.85m',  'Long Jump' : '7.02m',  'Triple Jump' : '14.21m',
				   'Shot Put' : '16.16m',  'Weight Throw' : '17.31m'};

var indudettes = { '60m' : '7.56', '200m' : '24.37', '400m' : '55.05', '800m' : '2:09.82',
				   Mile : '4:50.91',  '3000m' : '9:31.98',  '5000m' : '16:47.14',  '60 Hurdles' : '8.61',
				   'High Jump' : '1.69m',  'Pole Vault' : '3.91m',  'Long Jump' : '5.80m',  'Triple Jump' : '12.13m',
				   'Shot Put' : '13.62m',  'Weight Throw' : '17.34m'};

var dudes = { '100m' : '10.69', '200m' : '21.35', '400m' : '47.45', '800m' : '1:50.40',
				   '1500m' : '3:48.54', '5000m' : '14:22.10', '10000m' : '30:20.51', '110 Hurdles' : '14.65',  '400 Hurdles' : '53.22',
				   '3k Steeple' : '9:12.37',
				   'High Jump' : '2.02m',  'Pole Vault' : '4.77m',  'Long Jump' : '7.08m',  'Triple Jump' : '14.39m',
				   'Shot Put' : '16.11m', 'Javelin':'56.40m' };

var dudettes = { '100m' : '11.82', '200m' : '23.95', '400m' : '54.25', '800m' : '2:08.95',
				   '1500m' : '4:25.93', '5000m' : '16:46.20', '10000m' : '35:38.21', '100 Hurdles' : '13.78',  '400 Hurdles' : '1:01.10',
				   '3k Steeple' : '10:48.77',
				   'High Jump' : '1.69m',  'Pole Vault' : '3.88m',  'Long Jump' : '5.84m',  'Triple Jump' : '12.26m',
				   'Shot Put' : '14.18m' };
var standards = { male : dudes, female : dudettes }
var instandards = { male : indudes, female : indudettes }

//output objects
var men = {}
var women = {}
var menrecent = {}
var womenrecent = {}

var urlObject = {}
var indoorPRs = {}
var outdoorPRs = {}
var parent = {}

var learningExperiences = ["DNF", "ND", "FOUL", "NH", "NT", "DQ", "FS"]

// not used because fuck it, use string comparisons. used for % calcs now
function timeToMillis(string) {
	if(string && string.length > 0) {
		var ms = 0
		local = string
		ms += 10*parseInt(local.split('.').pop());
		local = local.slice(0, -3)
		var rest = local.split(':').reverse();
		currentVal=[1000,60000,3600000]
		for(var i = 0; i < rest.length; i++) {
			ms+=currentVal[i]*parseInt(rest[i])
		}
		return ms;
	} else {
		console.log("offending mark: "+string);
		return "-69";
	}
	return -69;
}

function timeFromMillis(ms) {
    return new Date(ms).toISOString().slice(11, -1);
}

// because fuckin lazy & don't feel like rewriting index js
var equivalencies = {
	"60" : "60m",
	"100" : "100m",
	"200" : "200m",
	"400" : "400m",
	"400" : "400m",
	"600" : "600m",
	"800" : "800m",
	"1000" : "1000m",
	"1500" : "1500m",
	"2000S" : "2k Steeple",
	"3000S" : "3k Steeple",
	"Mile" : "Mile",
	"3000" : "3000m",
	"5000" : "5000m",
	"10,000" : "10000m",
	"60H" : "60 Hurdles",
	"100H" : "100 Hurdles",
	"400H" : "400 Hurdles",
	"110H" : "110 Hurdles",
	"TJ" : "Triple Jump",
	"LJ" : "Long Jump",
	"HJ" : "High Jump",
	"PV" : "Pole Vault",
	"SP" : "Shot Put",
	"WT" : "Weight Throw",
	"JV" : "Javelin",
	"DMR" : "DMR",
	'4x400' : '4x400',
	'4x800' : '4x800',
	'4x100' : '4x100'
}
// 01/19 - Jan 20, 2018
// Jan 19-20, 2018
function applesDate(date) {
	var firstDay;
	var secondDay;
	var month;
	var year
	var out = []
	// month, firstday, secondday, year
	if(date.indexOf("/") > -1) {
		out[1] = parseInt(date.split(" ")[0].split("/")[1]);
	} else {
		out[1] = parseInt(date.split(" ")[1].split("-")[0]);
	}
	out[2] = parseInt(date.split(",")[0].slice(-2))
	out[3] = parseInt(date.slice(-4));
	out[0] = date.match("[A-Z]{1}[a-z]{2}")[0]
	return out;
}

function dateEqual(date1, date2) {
	a1 = applesDate(date1);
	a2 = applesDate(date2);

	return ((a1[0]===a2[0])&&(a1[0]===a2[0])&&(Math.abs(a1[1]-a2[1])<5)&&(Math.abs(a1[2]-a2[2])<5));
}

var season = "INDOOR";
var meetName = "";


async function compileRecentPerfs(date, gender, name, url) {
	var recentDateString = date;
	var weeksPerformances = []
	return new Promise(resolve => {
		var options = {
		  headers: {'user-agent': 'node.js'}
		}
		request(url, options, function (error, response, body) {
			// console.log('error:', error);
			// console.log('statusCode:', response && response.statusCode);
			$ = cheerio.load(body);
			meetDate = $('#meet-results').find('table').first().find('thead > tr > th > span').text().trim();
	
			if(meetDate.length > 0 && dateEqual(meetDate, recentDateString)) {
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
					if(!learningExperiences.includes(mark)) {
						if(mark.indexOf('m') > -1) {
							mark = mark.split('m')[0]+'m'; //gross
						} else if(mark.indexOf('\n') > -1) {
							mark = mark.split('\n')[0];
						}
						thisRow[1] = eventName;
						thisRow[2] = mark;
						//TODO adapt to include outdoor and also women
						thisRow[5] = gender === "male" ? prs.menObj[name][season][eventName] : prs.womenObj[name][season][eventName];
						thisRow[3] = standards[gender][eventName];
						if(mark.indexOf("m") > -1) {
							// distance or throw, strip 'm' and parse to int
							thisRow[4] = Math.max(0, (parseFloat(mark.replace("m", ""))/parseFloat(thisRow[3].replace("m",""))*100).toFixed(2))+"%";
							thisRow[6] = Math.max(0, (parseFloat(mark.replace("m", ""))/parseFloat(thisRow[5].replace("m",""))*100).toFixed(2))+"%";

						} else {
							thisRow[4] = Math.max(0,((timeToMillis(thisRow[3])/timeToMillis(mark))*100).toFixed(2))+"%";
							thisRow[6] = Math.max(0,((timeToMillis(thisRow[5])/timeToMillis(mark))*100).toFixed(2))+"%";
						}
					} else {
						thisRow[1] = eventName;
						thisRow[2] = mark;
						thisRow[4] = '0%'
						thisRow[6] = '0%'
					}
					weeksPerformances.push(thisRow);
				});
				resolve(weeksPerformances);
			} else {
				resolve([]);
			}
		});
	});
}

async function grabRoster(url) {
	return new Promise(resolve => {
		var out = {};
		var options = {
		  headers: {'user-agent': 'node.js'}
		}
		request(url, options, function (error, response, body) {
			// console.log('error:', error);
			// console.log('statusCode:', response && response.statusCode);
			$ = cheerio.load(body);

			$('h3').each(function(index, item) {
				if($(this).text().toUpperCase().indexOf('ROSTER') > -1) {
					$(this).parent().find('tbody > tr').each(function(item, index) {
						//console.log($(this).find('td').text().replace('\n', '').trim())
						var link = $(this).find('a');
						var name = link.text().split(',').reverse().join(' ').trim()
						out[name] = link.attr('href').replace('//www','https://www')

					});
				}
			});
			resolve(out)
		});
	});
}

//code for new TFRRS
async function compilePRsNew(url, gender) {
	return new Promise(resolve => {
		var options = {
		  headers: {'user-agent': 'node.js'}
		}
		request(url, options, function (error, response, body) {
			// console.log('error:', error);
			// console.log('statusCode:', response && response.statusCode);
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
						if(rawEvent.toUpperCase().indexOf("INDOOR") > -1) {
							if( indoorPRs[eventName] === undefined || isNewPR(indoorPRs[eventName], time) ) {
								indoorPRs[eventName] = time;
							}
							if(year === '2019' && isNewPR(instandards[gender][eventName], time)) {
								if(indoorPRs["ACC_"+eventName] === undefined || isNewPR(indoorPRs["ACC_"+eventName], time)) {
									indoorPRs["ACC_"+eventName] = time

								}
							}
						} else {
							if( outdoorPRs[eventName] === undefined || isNewPR(outdoorPRs[eventName], time) ) {
								outdoorPRs[eventName] = time;
							}
							if(year === '2019' && isNewPR(standards[gender][eventName], time)) {
								if(outdoorPRs["ACC_"+eventName] === undefined || isNewPR(outdoorPRs["ACC_"+eventName], time)) {
									outdoorPRs["ACC_"+eventName] = time
								}
							}
						}
					}
				});
			});
			resolve("done"); // because this is how promises are supposed to work
		});
	});
}

function isNewPR(oldMark, newMark) {
	var out = false;
	if((newMark).indexOf("m") > -1 && oldMark !== undefined) {
		nmc = parseFloat(newMark.replace("m",""));
		omc = parseFloat(oldMark.replace("m",""));
		out = (nmc > omc);
	} else if((newMark < oldMark && newMark.length == oldMark.length)) {
		out = true;
	}
	return out
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
	//names = (gender==="male") ? Object.keys(urlJson) : Object.keys(gurlJson);
	roster = (gender==="male") ? await grabRoster(mensUrl) : await grabRoster(womensUrl)
	names = Object.keys(roster)
	var numNames = 0;
	for(var i = 0; i < names.length; i++) {
		var url = (gender==="male") ? roster[names[i]] : roster[names[i]];
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
	roster = (gender==="male") ? await grabRoster(mensUrl) : await grabRoster(womensUrl)
 	names = Object.keys(roster)
	var numNames = 0;
	for(var i = 0; i < names.length; i++) {
		var url = (gender==="male") ? roster[names[i]] : roster[names[i]];
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

function checkForNewPRs(gender, newObj) {
	var groupMeOutput = "Shouts out to ";
	var currGender = gender==='male' ? prs.menObj : prs.womenObj
	//console.log(currGender)
	var ns = Object.keys(currGender);
	for(var i = 0; i < ns.length; i++) {
		var seasons = Object.keys(currGender[ns[i]]);
		for(var j = 0; j < seasons.length; j++) {
			var events = Object.keys(newObj[ns[i]][seasons[j]]);

			for(var k = 0; k < events.length; k++) {
				if((isNewPR(currGender[ns[i]][seasons[j]][events[k]], newObj[ns[i]][seasons[j]][events[k]]) && events[k].indexOf('ACC') == -1) || currGender[ns[i]][seasons[j]][events[k]] === undefined) {
					groupMeOutput+= ns[i]+" - "+events[k].replace('ACC_', '')+(events[k].indexOf('ACC') > -1 ? ' ACC Q' : ' PR')+": "+newObj[ns[i]][seasons[j]][events[k]];
					groupMeOutput+= currGender[ns[i]][seasons[j]][events[k]] === undefined ? ", " : " (was "+currGender[ns[i]][seasons[j]][events[k]]+"), "
				}
			}
		}
	}
	return groupMeOutput.slice(0,-2);
}

async function generateRecentPerfsToFile(dateStr) {
	try {
	   console.log("MEN");
	   let menrecent = await getRecentPerfsAsJSON(dateStr, "male");
	   var menJsonString = "var menObj="+JSON.stringify(menrecent)+";";
	} catch(err) {
	    console.log(err);
	}
	try {
	   console.log("WOMEN");
	   let womenrecent = await getRecentPerfsAsJSON(dateStr, "female");
	   var womenJsonString = "var womenObj="+JSON.stringify(womenrecent)+";";
	} catch(err) {
	    console.log(err);
	}
	var fullBlob = menJsonString+"\n"+womenJsonString+'\nvar dateComputed=\''+(new Date().toLocaleString()+'\'');
	var fs = require('fs');
	//todo : preserve old files, potentially move to archive folder
	fs.writeFile('recentDataObj.js', fullBlob, 'utf8', function(){
		console.log("File successfully written.")
	});
}

async function generatePRsToFile() {
	try {
		console.log("MEN");
	   let men = await getAllPRsAsJSON("male");
	   var menJsonString = "var menObj="+JSON.stringify(men)+";";
	   //console.log(checkForNewPRs('male', men));
	} catch(err) {
	    console.log(err);
	}
	try {
		console.log("WOMEN");
	   let women = await getAllPRsAsJSON("female");
	   var womenJsonString = "var womenObj="+JSON.stringify(women)+";";
	   //console.log(checkForNewPRs('female', women));
	} catch(err) {
	    console.log(err);
	}
	var fullBlob = menJsonString+"\n"+womenJsonString;
	fullBlob+='var dateComputed=\''+(new Date().toLocaleString()+'\';\nexports.menObj=menObj;\nexports.womenObj=womenObj;\n')
	var fs = require('fs');
	//todo : preserve old file, potentiallly move to archive folder
	fs.writeFile('prDataObj.js', fullBlob, 'utf8', function(){
		console.log("File successfully written.")
	});
}


//compilePRsNew('https://www.tfrrs.org/athletes/5459790/Georgia_Tech/Avery_Bartlett.html', 'male')
// var rossie = grabRoster(mensUrl).then(function(res) {
// 	console.log(res)
// });
//compileRecentPerfs('Feb 21-23, 2019', 'male', 'Avery Bartlett','https://www.tfrrs.org/athletes/5459790/Georgia_Tech/Avery_Bartlett.html' )

if(process.argv.length < 3) {
	console.log("Usage:\nnode prs.js pr\nnode prs.js recent 'Jan 19-20, 2018'");
} else if(process.argv[2] === 'pr') {
	generatePRsToFile();
} else if(process.argv[2] === 'recent') {
	if(process.argv.length == 4) {
		console.log("This process uses the PR document generated by \'node prs.js pr\'. Terminate this process and run \'node prs.js pr\' if you haven't yet.")
		generateRecentPerfsToFile(process.argv[3]);
	} else {
		console.log("Please specify date string: ")
		console.log("Usage:\nnode prs.js pr\nnode prs.js recent 'Jan 19-20, 2018'\nnode prs.js recent '01/19 - Jan 20, 2018'");
	}
} else if(process.argv[2] === 'names') {
	getAllURLs();
}

else {
	console.log("Usage:\nnode prs.js pr\nnode prs.js recent 'Jan 19-20, 2018'\nnode prs.js recent '01/19 - Jan 20, 2018'");
}

module.exports={
	generatePRsToFile: generatePRsToFile,
	generateRecentPerfsToFile: generateRecentPerfsToFile,
}
