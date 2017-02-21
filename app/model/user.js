var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
   username : {type: String, lowercase: true, required: true, unique: true},
   password : {type: String, required: true},
   email    : {type: String, lowercase: true, required: true, unique: true}
},{ collection: 'user' });

UserSchema.pre('save', function(next){
   var user = this;
   bcrypt.hash(user.password, null, null, function(err, hash){
      if (err) return next(err);
         user.password = hash;
         next();
   });
});

module.exports = mongoose.model('User', UserSchema);
