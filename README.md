# prs-list

Requires node.js

Do ```npm install ______``` on any requisite libraries

To run generate PR data:
```javascript
node prs.js prs
```

To generate recent performance list (reliant on PR data):
```javascript
node prs.js recent 'Jan 19-20, 2018'
```

getAllUrls() method generates the (prepopulated) ```urlJson``` and ```gurlJson``` variable of format ```name : url```.

Respective index.html files have JS that parses that JSON into the clickable HTML table

Code is horrible, almost by design. Enjoy.

Known issues:
Recent performance list start dates are currently hardcoded. Will address in the future.
Relies on a compiling 'prDataObj.js' file. If a corrupt one exists, delete it or make the file contents blank.