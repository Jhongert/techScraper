$(document).ready(function(){
	// Event listener for buttons save
	$(document).on('click', '.btn-add-note', addNote);
	$(document).on('click', '.btn-delete-note', deleteNote);

	var curCounter;

	$('#btn-save-note').on('click', function(){
		$('.text-danger').remove();

		var articleId = $(this).data('article-id');

		var $textarea = $('textarea');

		var note = $textarea.val().trim();

		data = {
			note: note,
			articleId: articleId
		}
		if(note.length == 0){
			var $p = $('<label class="text-danger">').text('Enter a note');
			$textarea.after($p);
		} else {
			$.post('/note/' + articleId, data, function(data){
				if(data){
					var dataArray = [];
					dataArray.push(data);
					createList(dataArray);
					updateCount(1);
				}
			});

			$textarea.val('');
			
		}
	});

	function updateCount(count){
		var counter = parseInt(curCounter.text()) + count;
		curCounter.text(counter);
	}

	function addNote(){
		curCounter = $(this).parent().prev();

		var articleId = $(this).data('article-id');

		$('#btn-save-note').data('article-id', articleId);
		$('textarea').val('');

		$.get('api/article/' + articleId, function(data){
			if(data){
				createList(data.note);
			}
		});

		$('#modal-note').modal();
	}

	function deleteNote(){
		var noteId = $(this).parent().data('note-id');

		var $li = $(this).parent().remove();
		$.post('/note/delete/' + noteId, function(data){
			if(data.status == 'ok'){
				$li.remove();
				updateCount(-1);
			}
		})
	}

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

	$('#modal-note').on('hidden.bs.modal', function (e) {
  		$('.text-danger').remove();
  		$('#note-container').empty();
  		$('textarea').val('');
  	});
});