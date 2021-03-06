var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var redis = require('redis'), 
    subscriber = redis.createClient(),
    publisher = redis.createClient();
var msg_count = 0;

var index = require('./routes/index');
var users = require('./routes/users');
var markdown = require('./routes/markdown');

var app = express();

// Include Ejs helpers
var helpers = require('express-helpers')(app);

//---------  Setup Mongo DB ----------------
// var MongoClient = require('mongodb').MongoClient
//   , assert = require('assert');
//  
// // Connection URL 
// var url = 'mongodb://localhost:27017/chat-express';
// // Use connect method to connect to the Server 
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server");
//  
//   insertDocuments(db, function() {
//     db.close();
//   });
// }); 
// 
// var insertDocuments = function(db, callback) {
//   // Get the documents collection 
//   var collection = db.collection('documents');
//   // Insert some documents 
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the document collection");
//     callback(result);
//   });
// }

//--- End of Mongo DB -------------------

/* Setup Redis*/ 


/* Set up Socket IO*/
app.io = require('socket.io')();

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


/*
 * Redis Pub/Sub connection
*/
// subscriber.on("subscribe", function (channel, count) {
//     publisher.publish("a nice channel", "I am sending a message.");
//     publisher.publish("a nice channel", "I am sending a second message.");
//     publisher.publish("a nice channel", "I am sending my last message.");
// });
// 
// subscriber.on("message", function (channel, message) {
//     console.log("sub channel " + channel + ": " + message);
//     msg_count += 1;
//     if (msg_count === 3) {
//         subscriber.unsubscribe();
//         subscriber.quit();
//         publisher.quit();
//     }
// });
// 
// subscriber.subscribe("a nice channel");


module.exports = app;
