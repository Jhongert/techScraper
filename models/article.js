var mongoose = require('mongoose');

var db = require('../config/connection');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	title: {
		type: String,
		require: true,
		unique: true
	},
	link: {
		type: String,
		require: true,
		unique: true
	},
	summary: String
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;