var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
   username : {type: String, lowercase: true, required: true, unique: true},
   fullname : {type: String,  required: true},
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

UserSchema.methods.comparePassword = function(password) {
   var user = this;
   return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);
