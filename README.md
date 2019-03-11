# prs-list
http://gtfrrs.com

Requires node.js

Do ```npm install ______``` on any requisite libraries

To run generate PR data:
```javascript
node prs.js prs
```

To generate recent performance list:
```javascript
node prs.js recent 'Jan 19-20, 2018'
```

autorun.js can (and does) run as a cron to ssh the output to a website (lol)

Respective index.html files have JS that parses that JSON into the clickable HTML table

Code is horrible, almost by design. Enjoy.

Known issues:
Recent performance list start dates are sort of hardcoded. Will address in the future.
Weird shit like outdoor/indoor ACC standards are hardcoded. Will adapt when it breaks.
