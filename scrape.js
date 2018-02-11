var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require("cheerio");

/* GET users listing. */
router.get('/', function(req, res, next) {

  var url= "https://www.basketball-reference.com/players/b/bryanko01/gamelog/1997";
  var query = {
  };

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



});

module.exports = router;
