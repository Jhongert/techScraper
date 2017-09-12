$(document).ready(function(){
	// Event listener for buttons save
	$(document).on('click', '.btn-add-note', addNote);
	$(document).on('click', '.btn-delete-note', deleteNote);

	$('#btn-save-note').on('click', function(){
		$('.text-danger').remove();

		var $textarea = $('textarea');

		var content = $textarea.val().trim();

		if(note.length == 0){
			var $p = $('<label class="text-danger">').text('Enter a note');
			$textarea.after($p);
		} else {
			var data = {
				content: content,
				articleId: $(this).data('article-id')
			}

			$.post('/note', data, function(data){
				if(data){
					var dataArray = [];
					dataArray.push(data);
					createList(dataArray);
				}
			});

			$textarea.val('');
			
		}
	});

	function addNote(){
		var articleId = $(this).parents('.panel').data('article-id');
		$('#btn-save-note').data('article-id', articleId);
		$('textarea').val('');

		$.get('api/note/' + articleId, function(data){
			if(data.length){
				createList(data);
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
			}
		})
	}

	function createList(data){
		for(var i = 0; i < data.length; i++){
			var $li = $('<li class="list-group-item">');
			var $button = $('<button class="btn btn-danger btn-delete-note">').text('x');
			$li.append($button);
			$li.append(data[i].content);
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