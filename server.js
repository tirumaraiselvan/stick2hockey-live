/**
 * Created by tselvan on 5/9/2015.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/client', function(req, res){
        res.sendFile('client.html', {root: __dirname});
    }
);

app.get('/includes/angular.js', function(req,res){
    res.sendFile('includes/angular.js',{root: __dirname})
});

app.get('/includes/jquery-1.11.2.min.js', function(req, res){
        res.sendFile('includes/jquery-1.11.2.min.js', {root: __dirname});
    }
);

app.get('/buzz.js', function(req,res){
    res.sendFile('buzz.js',{root: __dirname})
});

app.get('/admin', function(req, res){
        res.sendFile('admin.html', {root: __dirname});
    }
);
app.get('/includes/bootstrap.min.css', function(req, res){
    res.sendFile('includes/bootstrap.min.css', {root: __dirname});
});


io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('new:comment', function(msg){
            console.log('message:' +msg);
            io.emit('new:comment', msg);
        }
    );

    socket.on('disconnect', function () {
        console.log('user disconnected');
    })
});

http.listen(3000, function(){
        console.log('listening on port:3000');
    }
);

