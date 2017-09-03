var mongoose = require(mongoose);

var db = require('../config/connection');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	title: String,
	link: String,
	summary: String
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;