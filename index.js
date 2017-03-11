// SETUP
var express = require("express");
var app = express();
app.get('/', function(req, res) {
		res.send('Bot is happily running.');
});
app.listen(process.env.PORT || 5000);
var Twitter = require("twitter");
var AlchemyLanguageV1 = require('watson-developer-cloud/alchemy-language/v1');
var alchemy_language = new AlchemyLanguageV1({
		api_key: process.env.WATSON_AL_API_KEY
})
var mongoose = require('mongoose');
// END SETUP


// Ping Heroku ap to keep awake
var http = require("http");
setInterval(function() {
		http.get("http://whatsappling.herokuapp.com");
}, 600000); // every 10 minutes (600000)
// ^^^


var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
		access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var uri = 'mongodb://eddiepavdatabase:itweetaboutapples123@ds047166.mlab.com:47166/eddiepavtweet';
mongoose.connect(uri);
var db = mongoose.connection;
var Schema = mongoose.Schema;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(callback){

		console.log('db up');

		// Create schema for our data
		var TweetSchema = new Schema({
				"text": String,
				"truncated": Boolean,
				"in_reply_to_user_id": String,
				"in_reply_to_status_id": String,
				"favorited": Boolean,
				"source": String,
				"in_reply_to_screen_name": String,
				"in_reply_to_status_id_str": String,
				"id_str": String,
				"entities": {
						"user_mentions": [
								{
										"indices": Array,
										"screen_name": String,
										"id_str": String,
										"name": String,
										"id": Number
								}
						],
						"urls": Array,
						"hashtags": Array
				},
				"retweeted": Boolean,
				"in_reply_to_user_id_str": String,
				"place": {
						"attributes":{},
						"bounding_box":
						{
								"coordinates":
										[
												Number,
												Number
										],
								"type":String
						},
						"country":String,
						"country_code":String,
						"full_name":String,
						"id":String,
						"name":String,
						"place_type":String,
						"url": String
				},
				"retweet_count": Number,
				"created_at": String,
				"user": {
						"statuses_count": Number,
						"followers_count": Number,
						"profile_image_url": String,
						"listed_count": Number,
						"profile_background_image_url": String,
						"description": String,
						"screen_name": String,
						"default_profile": Boolean,
						"verified": Boolean,
						"time_zone": String,
						"profile_text_color": String,
						"is_translator": Boolean,
						"location": String,
						"id_str": String,
						"default_profile_image": Boolean,
						"lang": String,
						"friends_count": Number,
						"protected": Boolean,
						"favourites_count": Number,
						"created_at": String,
						"name": String,
						"show_all_inline_media": Boolean,
						"follow_request_sent": Boolean,
						"geo_enabled": Boolean,
						"url": String,
						"id": Number,
						"contributors_enabled": Boolean,
						"following": Boolean,
						"utc_offset": Number
				},
				"id": Number,
				"coordinates": {
						"coordinates":
								[
										Number,
										Number
								],
						"type":String
				},
				"sentimentTYPE": String,
				"sentimentSCORE": String,
				"eddieDidReply": Boolean
		});

		// Use schema to register a model with MongoDb
		mongoose.model('Tweet', TweetSchema);
		var Tweet = mongoose.model('Tweet');

		// UNCOMMENT To Test Schema and Connection
		// var gwTweet = new Tweet({
		// 		"text": "RT @PostGradProblem: In preparation for the NFL lockout, I will be spending twice as much time analyzing my fantasy baseball team during ...",
		// 		"truncated": true,
		// 		"in_reply_to_user_id": null,
		// 		"in_reply_to_status_id": null,
		// 		"favorited": false,
		// 		"source": "<a href=\"http://twitter.com/\" rel=\"nofollow\">Twitter for iPhone</a>",
		// 		"in_reply_to_screen_name": null,
		// 		"in_reply_to_status_id_str": null,
		// 		"id_str": "54691802283900928",
		// 		"entities": {
		// 				"user_mentions": [
		// 						{
		// 								"indices": [
		// 										3,
		// 										19
		// 								],
		// 								"screen_name": "PostGradProblem",
		// 								"id_str": "271572434",
		// 								"name": "PostGradProblems",
		// 								"id": 271572434
		// 						}
		// 				],
		// 				"urls": [ ],
		// 				"hashtags": [ ]
		// 		},
		// 		"contributors": null,
		// 		"retweeted": false,
		// 		"in_reply_to_user_id_str": null,
		// 		"place": null,
		// 		"retweet_count": 4,
		// 		"created_at": "Sun Apr 03 23:48:36 +0000 2011",
		// 		"retweeted_status": {
		// 				"text": "In preparation for the NFL lockout, I will be spending twice as much time analyzing my fantasy baseball team during company time. #PGP",
		// 				"truncated": false,
		// 				"in_reply_to_user_id": null,
		// 				"in_reply_to_status_id": null,
		// 				"favorited": false,
		// 				"source": "<a href=\"http://www.hootsuite.com\" rel=\"nofollow\">HootSuite</a>",
		// 				"in_reply_to_screen_name": null,
		// 				"in_reply_to_status_id_str": null,
		// 				"id_str": "54640519019642881",
		// 				"entities": {
		// 						"user_mentions": [ ],
		// 						"urls": [ ],
		// 						"hashtags": [
		// 								{
		// 										"text": "PGP",
		// 										"indices": [
		// 												130,
		// 												134
		// 										]
		// 								}
		// 						]
		// 				},
		// 				"contributors": null,
		// 				"retweeted": false,
		// 				"in_reply_to_user_id_str": null,
		// 				"place": null,
		// 				"retweet_count": 4,
		// 				"created_at": "Sun Apr 03 20:24:49 +0000 2011",
		// 				"user": {
		// 						"notifications": null,
		// 						"profile_use_background_image": true,
		// 						"statuses_count": 31,
		// 						"profile_background_color": "C0DEED",
		// 						"followers_count": 3066,
		// 						"profile_image_url": "http://a2.twimg.com/profile_images/1285770264/PGP_normal.jpg",
		// 						"listed_count": 6,
		// 						"profile_background_image_url": "http://a3.twimg.com/a/1301071706/images/themes/theme1/bg.png",
		// 						"description": "",
		// 						"screen_name": "PostGradProblem",
		// 						"default_profile": true,
		// 						"verified": false,
		// 						"time_zone": null,
		// 						"profile_text_color": "333333",
		// 						"is_translator": false,
		// 						"profile_sidebar_fill_color": "DDEEF6",
		// 						"location": "",
		// 						"id_str": "271572434",
		// 						"default_profile_image": false,
		// 						"profile_background_tile": false,
		// 						"lang": "en",
		// 						"friends_count": 21,
		// 						"protected": false,
		// 						"favourites_count": 0,
		// 						"created_at": "Thu Mar 24 19:45:44 +0000 2011",
		// 						"profile_link_color": "0084B4",
		// 						"name": "PostGradProblems",
		// 						"show_all_inline_media": false,
		// 						"follow_request_sent": null,
		// 						"geo_enabled": false,
		// 						"profile_sidebar_border_color": "C0DEED",
		// 						"url": null,
		// 						"id": 271572434,
		// 						"contributors_enabled": false,
		// 						"following": null,
		// 						"utc_offset": null
		// 				},
		// 				"id": 54640519019642880,
		// 				"coordinates": null,
		// 				"geo": null
		// 		},
		// 		"user": {
		// 				"notifications": null,
		// 				"profile_use_background_image": true,
		// 				"statuses_count": 351,
		// 				"profile_background_color": "C0DEED",
		// 				"followers_count": 48,
		// 				"profile_image_url": "http://a1.twimg.com/profile_images/455128973/gCsVUnofNqqyd6tdOGevROvko1_500_normal.jpg",
		// 				"listed_count": 0,
		// 				"profile_background_image_url": "http://a3.twimg.com/a/1300479984/images/themes/theme1/bg.png",
		// 				"description": "watcha doin in my waters?",
		// 				"screen_name": "OldGREG85",
		// 				"default_profile": true,
		// 				"verified": false,
		// 				"time_zone": "Hawaii",
		// 				"profile_text_color": "333333",
		// 				"is_translator": false,
		// 				"profile_sidebar_fill_color": "DDEEF6",
		// 				"location": "Texas",
		// 				"id_str": "80177619",
		// 				"default_profile_image": false,
		// 				"profile_background_tile": false,
		// 				"lang": "en",
		// 				"friends_count": 81,
		// 				"protected": false,
		// 				"favourites_count": 0,
		// 				"created_at": "Tue Oct 06 01:13:17 +0000 2009",
		// 				"profile_link_color": "0084B4",
		// 				"name": "GG",
		// 				"show_all_inline_media": false,
		// 				"follow_request_sent": null,
		// 				"geo_enabled": false,
		// 				"profile_sidebar_border_color": "C0DEED",
		// 				"url": null,
		// 				"id": 80177619,
		// 				"contributors_enabled": false,
		// 				"following": null,
		// 				"utc_offset": -36000
		// 		},
		// 		"id": 54691802283900930,
		// 		"coordinates": null,
		// 		"geo": null
		// });
		// sentimentAnaylsis(gwTweet.text, function(err, analysis){
		// 		if (err) throw err;
		// 		gwTweet.sentimentTYPE = analysis.docSentiment.type;
		// 		gwTweet.sentimentSCORE = analysis.docSentiment.score;
		// 		gwTweet.save(function (err, gwTweet) {
		// 				console.log("saved?");
		// 				if (err){
		// 						console.log('error');
		// 						return console.error(err);
		// 				}
		// 				console.log("saved!")
		// 		});
		//
		// 		console.log('got a tweet');
		// 		console.log(gwTweet.user.screen_name + ': tweet.text');
		// 		reTweet(gwTweet, function(err){
		// 				if (err) throw err;
		// 				replyTweet(gwTweet, function(){
		// 						if (err) throw err;
		// 				});
		// 		});
		//
		// });







		// // TODO: UNCOMMENT BEFORE PUSHING TO HEROKU
		// // TWITTER API CALLS
		// // Stream filters by keyword and OG tweets
		client.stream('statuses/filter', {track: 'onlyatgw'}, function(stream) {
				console.log('streaming twitter');

				stream.on('data',function(tweet) {

						// Check to be sure I am not retweeting or replying to myself
						if(tweet.user.id_str != "776578286864502786"){
								var gwTweet = new Tweet(tweet);
								sentimentAnaylsis(gwTweet.text, function(err, analysis){
										if (err) throw err;

										//IBM Watson Sentiment analysis
										gwTweet.sentimentTYPE = analysis.docSentiment.type;
										gwTweet.sentimentSCORE = analysis.docSentiment.score;

										console.log('got a tweet');
										console.log(gwTweet.user.screen_name + ': ' + tweet.text);

										// Retweet
										reTweet(gwTweet, function(err){
												if (err) throw err;

												// Send replyTweet 75% of time if sentimentTYPE != neutral or undefined
												var randomNum = Math.random();
												console.log('Random Num: ' + randomNum);
												if (randomNum <= 0.75 && gwTweet.sentimentTYPE != 'undefined' && gwTweet.sentimentTYPE != 'neutral' && gwTweet.sentimentTYPE != 'negative') {
														Tweet.findOne({id_str: gwTweet.id_str}, function(err, doc){
																if (err) throw err;

																doc.eddieDidReply = true;
																doc.save();

																replyTweet(gwTweet, function(){
																		if (err) throw err;
																});
														});

												}
										});


										// Save Tweet
										gwTweet.save(function (err, gwTweet) {
												console.log("saved?");
												if (err){
														console.log('error');
														return console.error(err);
												} else {
														console.log("saved!")
												}
										});

								});
						}

				});

				stream.on('error', function(error) {
						console.log('there is an error');
						console.log(error);
				});
		});

});





// WATSON-AL API CALLS
function sentimentAnaylsis(text, callback){
		var params = {
				text: text
		};
		alchemy_language.sentiment(params, function (err, response) {
				console.log('conducting sentiment analysis: ');
				if (err) {
						console.log('error:', err);
						return callback(err);
				}
				else {
						console.log('sentiment type: ' + response.docSentiment.type);
						return callback(null, response);
				}
		});
}
// ^^^


function reTweet(originalTweet, callback) {
		client.post('statuses/retweet/' + originalTweet.id_str, function(error, tweet, response) {
				console.log('retweeting');
				if (!error)	{
						console.log('retweeting: ' + tweet.user.screen_name + ': '+ tweet.text);
						return callback(error);
				}
				return callback(null);

		});
};

function replyTweet(originalTweet, callback) {
		client.post('statuses/update/', {status: '@'+originalTweet.user.screen_name + ' feeling ' + originalTweet.sentimentTYPE + ' about something?'}, function(error, tweet, response) {
				console.log('replying');
				if (!error) {
						console.log(tweet.text);
						return callback(error);
				}
				return callback(null);
		})
}