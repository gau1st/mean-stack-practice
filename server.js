var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var port       = process.env.PORT || 3000;
var User       = require('./app/model/user');

app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://127.0.0.1:27017/meanstackpractice');
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'Mongoose : connection error:'));
conn.once('open', function() {
   // Wait for the database connection to establish, then start the app.

   // http://localhost:3000/users
   app.post('/users', function (req, res) {
      var item = {
         username: req.body.username,
         password: req.body.password,
         email: req.body.email,
      }
      var user = new User(item);
      user.save();
      res.send('User created');
   });
});

app.listen(port, function () {
   console.log('Example app listening on port : ' + port);
});
