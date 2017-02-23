var FacebookStrategy = require('passport-facebook').Strategy;
var User             = require('../model/user');
var session          = require('express-session');
var jwt              = require('jsonwebtoken');
var secret           = "kijokobodo";

module.exports = function(app, passport) {

   app.use(passport.initialize());
   app.use(passport.session());
   app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

   passport.serializeUser(function(user, done) {
      token = jwt.sign({username: user.username, email: user.email, fullname: user.fullname}, secret, { expiresIn: '24h' });
      done(null, user.id);
   });

   passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
         done(err, user);
      });
   });


   passport.use(new FacebookStrategy({
         clientID: "1216946658426559",
         clientSecret: "c431e5ae24ea50bd477c4a5a876f67e4",
         callbackURL: "http://localhost:3000/auth/facebook/callback",
         profileFields: ['id', 'displayName', 'photos', 'email']
      },
      function(accessToken, refreshToken, profile, done) {
         console.log(profile);
         User.findOne({ email: profile._json.email }).select('username fullname password email').exec(function(err, user) {
            if (err) done(err);

            if (user && user != null) {
               done(null, user);
            } else {
               done(err);
            }
         });
      }
   ));

   // Facebook will redirect the user to this URL after approval.  Finish the
   // authentication process by attempting to obtain an access token.  If
   // access was granted, the user will be logged in.  Otherwise,
   // authentication has failed.
   app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/facebookerror/'}), function(req, res) {
      res.redirect('/facebook/'+token);
   });

   app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

   return passport;
}
