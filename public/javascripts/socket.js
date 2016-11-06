var socket = io.connect();

// Function call on send button click
function sendFunction() {
  // Send a "new message" with value of the new-message
  // field to the server
  socket.emit('new message', $('#new-message').val());
  
  // After sending the message to server, clear the 
  // input field
  $('#new-message').val('');
}

// Get chat message action from server
// append new message at the end of the site
socket.on('chat message', function(msg){
  $('#messages-area').append($('<li>').text(msg));
});

// Testing on socket emit
socket.on('news', function (data) {
  console.log(data);
  $('#socket').html(data["hello"]);
});