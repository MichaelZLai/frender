// SETUP
var express = require("express");
var app = express();
app.get("/", (req,res) => {
  res.send("Consequences...")
});
app.listen(process.env.PORT || 5000);
var mongoose = require("mongoose");

//////////////// TODO ////////////////
//  Ping Heroku to keep app awake
// var http = require("http");
// setInterval( _ =>{
//   http.get("www.frender.com")
// }, 600000); // 600000 = every 10 minutes

// Setup Twitter API
var Twitter = require("twitter");
var bluebird = require("bluebird");
var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Stream filters by keywords
var options = {track: 'french'};
var search = "statuses/filter";
twitterClient.stream(search, options, (stream) => {
  console.log("streaming twitter feed");

  stream.on("tweets", (tweet) =>{
    console.log("Looks like you got a tweet");


    console.log(tweet.user.screen_name);

  })
});


// pass in the search string, an options object, and a callback
// var options = { count: 100};
// var search = "french";
//
// var test = twitterClient.search(search, options, (data) =>{
//   results = results.concat(data.statuses);
//   options = {}
//   options.max_id = data.statuses[ data.statuses.length - 1 ].id;
//   options.count = 100;
//
//   twitterClient.search(search, options, (data) =>{
//     results = results.concat(data.statuses);
//     options = {}
//     options.max_id = data.statuses[ data.statuses.length - 1 ].id;
//     options.count = 100;
//
//     twitterClient.search(search, options, (data) =>{
//       results = results.concat(data.statuses);
//       // do stuff with your 300 total tweets
//     }
//   }
// };
