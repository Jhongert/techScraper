var express = require('express');
var router = express.Router();
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

var Article = require('../models/article');


router.get('/', function(req, res){
	res.render('index', {articles: 'data'});
});

router.get('/articles', function(req, res){
	res.render('articles', {articles: 'data'});
});

router.get('/scrape', function(req, res){
	var site = 'https://www.nytimes.com/section/technology';
	request(site, function(error, res, html){
		// Load the HTML into cheerio and save it to a variable
  		// '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  		var $ = cheerio.load(html);

  		var results = [];

  		$('a.story-link').each(function(i, element){
  			
  			var title = $(element).find('h2.headline').text().trim();
  			var link = $(element).attr('href').trim();
  			var summary = $(element).find('p.summary').text().trim(); 

  			Article.findOne({'title': title}, '_id', function(error, result){
  				 if(!result){
  				 	console.log('result');
  					var newArticle = new Article({
		  				title: title,
		  				link: link,
		  				summary: summary
		  			});

		  			newArticle.save(function(error){
		  				if(error) console.log('Error saving article:', error);
		  			});
  				 }
  			});		
  		});
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