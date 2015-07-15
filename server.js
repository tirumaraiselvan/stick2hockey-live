/**
 * Created by tselvan on 5/9/2015.
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;

app.use(express.static(__dirname + '/public' ));

app.get('/client', function(req, res){
        res.sendFile('public/client.html', {root: __dirname});
    }
);

app.get('/admin', function(req, res){
        res.sendFile('admin.html', {root: __dirname});
    }
);

MongoClient.connect('mongodb://localhost:27017/commentary', function(err, db) {
  if(!err) {
    console.log('We are connected');

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('new:comment', function(comment){
            console.log('message:' +comment);
            //mongodb insert statement
	    db.collection('matches').insert(comment, function(err, res) {
	    if(err) throw err;
            io.emit('new:comment', comment);
        });
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

}
});

http.listen(3000, function(){
        console.log('listening on port:3000');
    }
);

