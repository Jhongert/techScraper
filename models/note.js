var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	note: String,
	articleId: Schema.Types.ObjectId
});

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;