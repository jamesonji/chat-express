var EDITORCOUNT = 0;

// pass in the editor id number
var addEditor = function( num ){
  // create a editor id in the form of 'editor-n'
  var editorId = 'editor-' + num;
  // create a editor with the id provided above
  var editor = ace.edit(editorId);
  // set the editor theme
  editor.setTheme("ace/theme/monokai");
  // set the editor mode
  editor.getSession().setMode("ace/mode/javascript");
  
  editor.getSession().setUseWrapMode(true);

  editor.setHighlightActiveLine(true);

  // don't show the margin
  editor.setShowPrintMargin(false);
}

$('#add-editor').click(function(){
  // check how many ace-editor exists in the form
  // var editorCount = $('.ace-editor').children().length;
  EDITORCOUNT += 1;
  $('.editor-container').append("<div class='ace-editor' id= 'editor-"+ EDITORCOUNT + "'></div>");
  addEditor(EDITORCOUNT);
});

$(function(){
  
})