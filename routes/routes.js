var express = require('express');
var router = express.Router();
// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

var db = require('../config/connection');

var Article = require('../models/article');
var Note = require('../models/note');

function scraper(callBack){
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

			var newArticle = new Article({
				title: title,
				link: link,
				summary: summary
			});

			newArticle.save(function(error){
				//if(error) console.log('Error saving article:', error);
			});		
  		});

  		callBack();
	});
}

// Get all articles
router.get('/', function(req, res){
	Article.find().sort({"dateAdded": -1}).exec( function(err, data){
		if(err) throw 'Error getting articles';

		res.render('index', {articles: data});
	});
});

router.get('/scrape', function(req, res){
	scraper(function(){
		res.redirect('/');
	});
});

//get notes by article id
router.get('/api/article/:id', function(req, res){
	Article.findOne({_id: req.params.id})
	.populate('note')
	.exec(function(err, data){
		if(err){
			console.log(err)
		} else {
			res.json(data);
		}
	});
});

router.post('/note/:id', function(req, res){

	var newNote = Note(req.body);

	newNote.save(function(err, noteDoc){
		if(err){
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id':req.params.id}, {$push: {'note': noteDoc._id}}, {new: true})
			.exec(function(err, articleDoc){
				if(err){
					console.log(err);
				} else {
					res.json(noteDoc);
				}
			});
		}
		
	});
	
});

router.post('/note/delete/:id', function(req, res){
	Note.findOneAndRemove({_id: req.params.id}, function(err, deletedNote){
		if(!err){
			console.log(deletedNote.articleId);

			Article.findOneAndUpdate({_id: deletedNote.articleId}, { $pull: {'note': deletedNote._id}}, function(err){
				if (!err) res.json({status: 'ok'});
			});
		}
	})
});

module.exports = router;