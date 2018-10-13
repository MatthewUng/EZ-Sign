var express = require('express');
var app = express();
var sendEnvelope = require('./sendEnvelope');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded( { extended:true}));

app.use(express.static('public'));
app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/submit_redirect', function (req, res) {
  
  var name = req.body.name;
  var email = req.body.email;
  sendEnvelope.SendEmail(name,email, app);
  res.redirect('/');
})

var server = app.listen(3000, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})
