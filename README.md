# KB824

## Background and Overview

Kobe Bryant was one of basketball most endearing superstars of the modern era amassing over 30,000 points, 5 NBA championships, and 3 total Most Valuable Player awards (2x Finals, 1x regular season). He was known for his incredible work ethic and absolute skill in the game of basketball as well as giving it all to those less fortunate.

KB824 is a web application that will take a look into his illustrious 20 year career with the Los Angeles Lakers. This visualization project will hope to have a timeline illustrating all his games and his effectiveness in each one. This project will hope to have many interactive elements including the following:

* Big Games
* Filterable states
* Home/Away Splits
* Heatmap vs Opponents

## Functionality & MVP

![KB824](https://i.imgur.com/rqS09h0.png)

Users will be able to view the stats from each of these games that will be compile in a node bubble of varying sizes. The size will depend on two factors. One is the category the users is currently on (eg points, rebounds, assists, etc.) and two, the actual amount of that stat Kobe had achieved for that game. Users are able to view these trends via a line graph with the x-axis being time.

Users have the ability to adjust the stats being displayed on the screen.

Also included will be a brief summary on how his numbers compare to other all time legends.

## Architecture and Technologies

* D3.js
* Superagent and Cheerios to scrape data
* Webpack to bundle scripts
* Vanilla JavaScript for conditional rendering of different graphs

## Implementation Timeline

### Over the weekend:

* Learn Superagent and Cheerios to scrape NBA API for data
* Become familiar with d3 library
* Preliminary setup of files and Github

### Day 1:

Setup the Node modules, create `webpack.config.js` file for webpack. Create an entry file and write out the bare bones for the timeline.

### Day 2:

* Create some part of the timeline using d3.
* Write mouseover events.

### Day 3:

* Write out additional code for the timeline
* Write click event handlers
* Write out logic for switching between graph information.
* Begin styling

### Day 4:

* Complete the styling of each graph.
* Create slider for adjusting year.

## Bonus Features

* Create a heat map of Kobe games against other teams on US Map
