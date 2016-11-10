// pass in the editor id number
var addEditor = function( num ){
  var editorId = 'editor-' + num;
  var editor = ace.edit(editorId);
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.setShowPrintMargin(false);
}

$('#add-editor').click(function(){
  console.log('Add editor is working!');
  var editorCount = $('.ace-editor').children().length;
  var nextId = editorCount + 1;
  $('.editor-container').append("<div class='ace-editor' id= 'editor-"+ nextId + "'></div>");
  addEditor(nextId);
});