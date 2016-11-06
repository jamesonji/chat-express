var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var index = require('./routes/index');
var users = require('./routes/users');
var markdown = require('./routes/markdown');

var app = express();

// Include Ejs helpers
var helpers = require('express-helpers')(app);

/* Set up Socket IO*/
app.io = require('socket.io')();

/* File system */

// // this will read and log file content ayncally
// fs.readFile('input.txt', function(err, data){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log('Async data is' + data.toString());
//   }
// });
// 
// // Syc read files, this will excute at once
// var data = fs.readFileSync('input.txt');
// console.log('Sync data is' + data.toString());
// 
// 
// // This will create a tradbale stream by chuncks from input.txt
// var readableStream = fs.createReadStream('input.txt');
// var data = '';
// readableStream.setEncoding('UTF8');
// readableStream.on('data', function(chunk){
//   data += chunk;
// });
// 
// readableStream.on('end', function(){
//   console.log(data);
// })

// // This will create a new file called output.txt and insert write data to it
// var writeData = 'Hello World';
// var writeableStram = fs.createWriteStream('output.txt');
// writeableStram.write(writeData,'UTF8');
// 
// writeableStram.end();
// writeableStram.on('finish',function(){
//   console.log('Write Completed');
// })

// Pipes
// this code will bring all content from input.txt to output.txt
var readableStream = fs.createReadStream('input.txt');
var writeableStram = fs.createWriteStream('output.txt');
readableStream.pipe(writeableStram);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/ace-builds', express.static(__dirname + '/node_modules/ace-builds'));

app.use('/', index);
app.use('/users', users);
app.use('/markdown', markdown);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/** 
 * Socket IO connection, use app.io instead of just "io"
**/
app.io.on('connection', function (socket) {
  console.log('a user connected');
  
  socket.emit('news', { hello: 'world' });
  
  // Server listens to the client, getting the messages sent
  // from client, and log to the console
  socket.on('new message', function(msg){
    console.log('new message: ' + msg);
    
    // send back chat message and trigger chat message action
    app.io.emit('chat message', msg);
  });
  
  socket.on('disconnect', function() {
      console.log('Got disconnect!');
  });
});

module.exports = app;
