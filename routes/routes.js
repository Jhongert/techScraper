var express = require('express');
var router = express.Router();
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");


router.get('/', function(req, res){
	res.send('root');
});

router.get('/scrape', function(req, res){
	var site = 'https://www.nytimes.com/section/technology';
	request(site, function(error, res, html){
		// Load the HTML into cheerio and save it to a variable
  		// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  		var $ = cheerio.load(html);

  		var results = [];

  		$('a.story-link').each(function(i, element){
  			var link = $(element).attr('href').trim();
  			var title = $(element).find('h2.headline').text().trim();
  			var summary = $(element).find('p.summary').text().trim(); 

  			results.push({
  				title: title,
  				link: link,
  				summary: summary
  			});
  		});
  		console.log(results);
	});
});

router.get('/note/:id', function(req, res){
	res.send('get note');
});

router.post('/note/:id', function(req, res){
	res.send('post note id');
});

router.post('note/delete/:id', function(req, res){
	res.send('delete note');
});

module.exports = router;