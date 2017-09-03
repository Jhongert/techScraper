var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/techscraperdb');

var db = mongoose.connection;

db.on('error', function(){
	console.log('Connection error')
});

db.once('open', function(){
	console.log('Connected to DB')
});

module.exports = db;