# KB824
## A Journey Through the Data

![Kobe-Dear-Basketball](https://raw.githubusercontent.com/GreenRabite/KB824/master/app/assets/images/other_images/dear.jpg)

Kobe Bryant was one of basketball most endearing superstars of the modern era amassing over **30,000** points, **5 NBA championships**, and 3 total **Most Valuable Player awards** (2x Finals, 1x regular season). He was known for his incredible work ethic and absolute dedication to the game and whose influence is beginning to mature in the superstars of today.

KB824 is a web application that will take a look into his illustrious 20 year career with the Los Angeles Lakers using vanilla JavaScript and a JavaScript library known as **d3** to bring the data to life.

Technologies Used

### Webscraping The Data

The dataset for the games played was obtained by webscraping from basketball reference sites. This was done using *SuperAgent*, a small progressive client-side HTTP request library and *Cheerio*, a library which parses markups and provides an API for traversing/manipulating the resulting DOM data structure. The API call is as follow and was very short itself. Meaningful cleaning of the data had to be performed after extraction of the data ad if I had to do it again, I would look to see if I could extract the data more cleanly.
```javascript
superagent
  .get(url)
  .query()
  .end(function(err,response){
    if (err) {
      res.json({
        confirmation: "fail",
        message: err
      });
      return;
    }

    $ = cheerio.load(response.text);
    // var gameTable = $('#pgl_basic.1');
    // console.log(gameTable);
    $(`pgl_basic.1`).each((i,element)=>{
      console.log(element);
      console.log(i);
    });
    res.send(response.text);
  });
  ```

### Scatterplot of the Data
![Data Set]()

In all, over 1400 different nodes (games) were harvested and cleaned. The data was formatted into a *comma separated value* (**CSV**), a format parsable to **D3**.  A snippet of each node can be seen below:
`Rk,G,Date,Age,Tm,,Opp,,GS,MP,FG,FGA,FG%,3P,3PA,3P%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS,GmSc`
`1,1,1996-11-03,18-072,LAL,,MIN,W (+6),0,6:00,0,1,.000,0,0,,0,0,,0,1,1,0,0,1,1,1,0,-1.1`
