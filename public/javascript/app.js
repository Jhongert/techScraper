$(document).ready(function(){
	// Event listener for buttons add and delete notes
	$(document).on('click', '.btn-add-note', addNote);
	$(document).on('click', '.btn-delete-note', deleteNote);

	var curCounter;

	// Button save note click event
	$('#btn-save-note').on('click', function(){
		// Remove any error message from the modal window
		$('.text-danger').remove();

		// get the article id from the data attr in this button
		var articleId = $(this).data('article-id');

		// get the text element
		var $textarea = $('textarea');

		// get the content from the textarea
		var note = $textarea.val().trim();

		// display an error if the text area is empty
		if(note.length == 0){
			var $p = $('<label class="text-danger">').text('Enter a note');
			$textarea.after($p);
		} else {
			// create a object with the note and article id
			data = {
				note: note,
				articleId: articleId
			}
			// post the new note
			$.post('/note/' + articleId, data, function(data){
				// if the note is saved successfully then create an array with the new note
				// call createList function to add the new note to the list
				// and update the count of notes for the current article
				if(data){
					var dataArray = [];
					dataArray.push(data);
					createList(dataArray);
					updateCount(1);
				}
			});

			// empty the textarea
			$textarea.val('');
			
		}
	});

	// this function updates the count of notes for the current article
	function updateCount(count){
		var counter = parseInt(curCounter.text()) + count;
		curCounter.text(counter);
	}

	// this function is called when clicking the add note button 
	function addNote(){
		// get the span element that hode the number of notes
		curCounter = $(this).parent().prev();

		// get the article id 
		var articleId = $(this).data('article-id');

		// store the article id in save button's data attr 
		$('#btn-save-note').data('article-id', articleId);
		$('textarea').val('');

		// get the notes for this article
		$.get('api/article/' + articleId, function(data){
			// if there are notes create the list of notes
			if(data){
				createList(data.note);
			}
		});

		// show the modal box
		$('#modal-note').modal();
	}

	// this function is called when clicking delete note button
	function deleteNote(){
		// get the note's id
		var noteId = $(this).parent().data('note-id');

		// get the li element that holds the note to be deleted
		var $li = $(this).parent().remove();

		// send the request to the server to delete the note
		$.post('/note/delete/' + noteId, function(data){
			// if the note was deleted successfully
			// remove the list element and update the number of notes
			if(data.status == 'ok'){
				$li.remove();
				updateCount(-1);
			}
		})
	}

	// this function create a list of notes with a delete button
	function createList(data){
		for(var i = 0; i < data.length; i++){
			var $li = $('<li class="list-group-item">');
			var $button = $('<button class="btn btn-danger btn-delete-note">').text('x');
			$li.append($button);
			$li.append(data[i].note);
			$li.data('note-id', data[i]._id);
			$('#note-container').append($li);
		}
	}

	// when the modal box is hidden 
	//remove any message, empty the list and the textarea
	$('#modal-note').on('hidden.bs.modal', function (e) {
  		$('.text-danger').remove();
  		$('#note-container').empty();
  		$('textarea').val('');
  	});
});