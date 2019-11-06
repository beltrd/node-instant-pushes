var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var config = require('./config');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(config.dbUrl , { useNewUrlParser: true, 
  useUnifiedTopology: true } , 
  (err) => { 
  console.log('mongodb connected', err);
});

var Message = mongoose.model('Message', { name : String, message : String})

var server = app.listen(3000, () => {
  console.log('The server is running on port', server.address().port);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname));

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    res.sendStatus(200);
  })
})