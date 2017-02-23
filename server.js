var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var mongoose   = require('mongoose');
var router     = express.Router();
var appRoute   = require('./app/route/api')(router);
var path       = require('path');
var passport   = require('passport');
var social     = require('./app/passport/passport')(app, passport);
var port       = process.env.PORT || 3000;
var mongoUrl   = 'mongodb://gau1st:gilang86@ds157499.mlab.com:57499/test-mongo-gau1st';

app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));


mongoose.connect(mongoUrl);
var conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'Mongoose : connection error:'));
conn.once('open', function() {
   // Wait for the database connection to establish, then start the app.
   app.use('/api', appRoute);
});

app.get("*",function(req, res) {
   res.sendFile(path.join(__dirname + '/public/app/view/index.html'));
});

app.listen(port, function () {
   console.log('Example app listening on port : ' + port);
});
