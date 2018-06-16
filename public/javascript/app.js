
$(document).on("click", "#saveArticle", function() {
 
  
  var thisId = $(this).attr("data-id");
  var button=$(this);
 
  $.ajax({
    method: "GET",
    url: "/articleSaved/" + thisId
  })
  
    .then(function(data) {
    
     button.text("SAVED !!!");
     button.attr('disabled','disabled');
         
    });
});

$(document).on("click", "#delArticle", function() {
 
  
  var thisId = $(this).attr("data-id");
  var button=$(this);

  
  $.ajax({
    method: "GET",
    url: "/removeSaved/" + thisId
  })
    
    .then(function(data) {
    
     button.parent().parent().parent().remove();
   
      $("#alertModal").modal("show");
    });    
         
});


  function scrape(link){  
 
  $.ajax({
    method: "GET",
    url: "/scrapeArticles"
  })
    
    .then(function(data) {         
      location.reload(true);   
    });
}


$(document).on('show.bs.modal', '#notesModal', function(event) {
  var button = $(event.relatedTarget); 
  var articleId = button.data('id'); 
  
  var modal = $(this)
  modal.find('.modal-title').text('Article Notes');
  modal.find('.saveNoteBtn').attr('data-id',articleId);
 

$.ajax({
  method: "GET",
  url: "/getNotes/" + articleId
})
  
  .then(function(data) {
    console.log(data);
   
    if (data.notes.length!==0) {
      $("#notes-form").find("#noNotes").remove();
      $.each(data.notes, function( index, value ) {
        $("#notes-form").prepend("<div class='well mynotes'><span>" + value.message + "</span><span class='glyphicon glyphicon-remove delNoteBtn' id='"+value._id+"'></span></div>");
      });
    }
    else{
      $("#notes-form").prepend("<div class='well' id='noNotes'>No Notes for this Article yet.</div>");

    }
  });
});


$(document).on('hidden.bs.modal', '#notesModal', function(event) {
  $(".mynotes").remove();
  $("#notes-form").find("#noNotes").remove();
  $('#notesinput').val('');
});



$(document).on("click", ".saveNoteBtn", function() {
 
  
  var articleId = $(this).attr("data-id");
  var noteText=$("#notesinput").val().trim();
  if(noteText!==""){
  
  $.ajax({
    method: "POST",
    url: "/saveNote/" + articleId,
    data: {
      
      message: noteText,
    }
  })
   
    .then(function(data) {
      
      $('#notesModal').modal('hide');
      
    });
  }

 
  
});


$(document).on("click", ".delNoteBtn", function() {
 

  var noteId = $(this).attr("id");
 
  $.ajax({
    method: "GET",
    url: "/deleteNote/" + noteId,
    })
  
    .then(function(data) {
    
      $('#'+noteId).parent().remove();
     
    });

 
  
});