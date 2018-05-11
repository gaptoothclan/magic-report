var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');

var days = ["Sun", "Mon", "Tue", "Wed","Thu","Fri","Sat"];

// Send url as parameter
// Cache data daily
// Build another end point to get all spot data
// Create alerts sms

/* GET home page. */

router.get("/multireport", function(req,res, next){

  let reportsToGet = [
    "http%3A%2F%2Fmagicseaweed.com%2FKimmeridge-Surf-Report%2F11%2F"
    //"http%3A%2F%2Fmagicseaweed.com%2FCroyde-Beach-Surf-Report%2F7%2F"
    //"http%3A%2F%2Fmagicseaweed.com%2FKimmeridge-Surf-Report%2F11%2F"
  ];

  res.json({ nothing: "yet"});
});

router.get('/', function(req, res, next) {

    if (!req.query || !req.query.url){
      return res.json({ error: "Provide a url"});
    }

    let testUrl = decodeURIComponent(req.query.url);
    if (testUrl.match(/http(s*):\/\/(www.)*magicseaweed.com\/[a-zA-Z-]+\/[0-9]+\//g) === null){
      return res.json({ error: "Url format"});
    }

    url = testUrl;

    request(url, function(error, response, html){
      let returnData = [];

        if(!error){
            var $ = cheerio.load(html);
            


            $("tr.msw-fc-primary").each(function(i, elem) {
              var row = $(this);
              //console.log(item.html());

              var timeStamp = row.attr('data-timestamp');

              var dateObj = new Date(parseInt(timeStamp) * 1000);
  



              var swell = row.find(".msw-fc-fps").text().replace(/[^0-9.]/g, "");
              var period = row.find(".msw-fc-ps:not(.msw-fc-lps):not(.msw-fc-fps)").text().replace(/[^0-9.]/g, "");
              var swellDirection = row.find(".msw-fc-lps").text().replace(/[^0-9.]/g, "");

              var wind = row.find(".msw-fc-w").text().trim().split(" ")[0];
              var windDirection = row.find(".msw-fc-wa").html().match(/\(([0-9]+)/)[1];


              if (dateObj.getHours() == 13){
                returnData.push({
                  timeStamp: timeStamp,
                  day: days[dateObj.getDay()],
                  swell: swell, 
                  period: period,
                  swellDirection: swellDirection,
                  wind: wind,
                  windDirection: windDirection
                });
              }


              //console.log( item.attr('data-timestamp') );
              //fruits[i] = $(this).text();
            });
        }

            


      res.json(returnData);
    });
});

module.exports = router;
