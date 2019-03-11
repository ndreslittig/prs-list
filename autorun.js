#!/usr/bin/env node
var prs = require('./prs.js');
var node_ssh = require('node-ssh')

async function process() {
	  console.log('generating PRs');
	  await prs.generatePRsToFile();
	  console.log('done generating PRs \n')
	  var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	  var date = new Date();
	  endRange = date.getDate() // 29
	  date.setDate(date.getDate()-3);
	  month = shortMonths[date.getMonth()];
	  inputString = month+' '+date.getDate()+'-'+endRange+', '+date.getFullYear()
	  await prs.generateRecentPerfsToFile(inputString);

	  ssh = new node_ssh()

	  ssh.connect({
		      host: '192.254.190.187',
		      port: 2222,
		      username: 'alittig',
		      privateKey: '/home/daddy/.ssh/id_hg_rsa',
		      passphrase: 'dont commit passphrases you idiot, make this an env instead',

		    }).then(function() {

			      ssh.putFiles([{ local: 'prDataObj.js', remote: '/home2/alittig/public_html/gtfrrs/prDataObj.js' }, { local: 'recentDataObj.js', remote: '/home2/alittig/public_html/gtfrrs/recentDataObj.js' }]).then(function() {
				          console.log("The File thing is done")
				      ssh.dispose();
				        }, function(error) {
						    console.log("Something's wrong")
						    console.log(error)
						  })

		    })
}

process()
