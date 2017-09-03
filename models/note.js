var mongoose = require(mongoose);

var db = require('../config/connection');

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	content: String
});

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;