var mongoose = require('mongoose');

mongoose.Promise = Promise;

//mongoose.connect('mongodb://localhost/techscraperdb');
mongoose.connect('mongodb://heroku_h791bs5z:455u1p927e5m2kabbrtap9vdor@ds121014.mlab.com:21014/heroku_h791bs5z');

var db = mongoose.connection;

db.on('error', function(){
	console.log('Connection error')
});

db.once('open', function(){
	console.log('Connected to DB')
});

module.exports = db;