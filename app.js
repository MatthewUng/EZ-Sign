var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sendEnvelope = require('./sendEnvelope');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded( { extended:true}));
app.use(express.static('public'));

app.post('/submit_redirect', function (req, res) {

    var name = req.body.name;
    var email = req.body.email;
    console.log("inside redirect: "+name);

    sendEnvelope.SendEmail(name, email, app);
    res.redirect('/');

    })

io.on('connection', function(socket){
    console.log('a user connected');
    
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('update', function(text){
        console.log('text: ' + text);
        io.emit('update', text);
    });
});

http.listen(3000, function () {
    console.log("App running at localhost:3000");
});


