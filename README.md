# prs-list

Requires node.js

Do 'npm install ______' on any requisite libraries

'node prs.js' or 'node prs_girls' to run

getAllUrls() method generates the (prepopulated) urlJson variable of name : url

getAllPRsAsJSON() processes that list and generates a huge JSON blob of PRs

Huge JSON blob is saved as a js var in prObject.js/prObject_girls.js

Respective index.html files have JS that parses that JSON into the clickable HTML table

Code is horrible, almost by design. Enjoy.