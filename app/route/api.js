var User   = require('../model/user');
var jwt    = require('jsonwebtoken');
var secret = "kijokobodo";

module.exports = function(router) {

   // http://localhost:3000/api/users
   // USER REGISTRATION ROUTE //
   router.post('/users', function (req, res) {
      if (req.body.username == null  || req.body.username == ""
         || req.body.fullname == null  || req.body.fullname == ""
         || req.body.password == null || req.body.password == ""
         || req.body.email == null || req.body.email == "") {

            if ( req.body.email == null || req.body.email == "") {
               res.json({success: false, message:"Ensure email was provided."});
            } else if (req.body.username == null  || req.body.username == "") {
               res.json({success: false, message:"Ensure username was provided."});
            } else if (req.body.fullname == null  || req.body.fullname == "") {
               res.json({success: false, message:"Ensure full name was provided."});
            } else if (req.body.password == null || req.body.password == "") {
               res.json({success: false, message:"Ensure password was provided."});
            } else {
               res.json({success: false, message:"Ensure email, username and password was provided."});
            }

      } else {
         strUsername = req.body.username.replace(/\s+/g, '');
         strFullname = req.body.fullname;
         strPassword = req.body.password;
         strconfirmPassword = req.body.confirmpassword;
         strEmail = req.body.email;
         var item = {
            username: strUsername,
            fullname: strFullname,
            password: strPassword,
            email: strEmail,
         }
         var user = new User(item);
         if (strUsername == "" || strFullname=="" || strPassword == "" || strEmail == "") {
            res.json({success: false, message:"Ensure username, email and password was provided."});
         } else {
            function validateEmail(email) {
               var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
               return re.test(email);
            }
            if (!validateEmail(strEmail)) {
               res.json({success: false, message:"Please Input a valid email."});
            } else {
               if (strPassword != strconfirmPassword) {
                  res.json({success: false, message:"confirm password is not same with password"});
               } else {
                  user.save(function(err){
                     if (err) {
                        if (err.errmsg.includes("duplicate key") && err.errmsg.includes("email")) {
                           res.json({success: false, message:"Email : \""+strEmail+"\" is not available."});
                        } else if (err.errmsg.includes("duplicate key") && err.errmsg.includes("username")) {
                           res.json({success: false, message:"Username : \""+strUsername+"\" is not available."});
                        } else {
                           res.json({success: false, message:err.errmsg});
                        }
                     } else {
                        res.json({success: true, message:"User created."});
                     }
                  });
               }
            }
         }
      }
   });

   // http://localhost:3000/api/users/auth
   // USER LOGIN ROUTE //
   router.post('/users/auth', function (req, res) {
      User.findOne( {username: req.body.username} ).select('email username fullname password').exec(function(err, user) {
         if (err) throw err;

         if (!user) {
            res.json({success: false, message:"Could not authenticate user."});
         } else {
            if (req.body.password) {
               var validPassword = user.comparePassword(req.body.password);
               if (!validPassword) {
                  res.json({success: false, message:"Could not authenticate password."});
               } else {
                  var token = jwt.sign({username: user.username, email: user.email, fullname: user.fullname}, secret, { expiresIn: '24h' });
                  res.json({success: true, message:"User authenticated!!!.", token: token});
               }
            } else {
               res.json({success: false, message:"Could not authenticate password."});
            }
         }
      });
   });

   router.use(function(req, res, next) {
      var token = req.body.token || req.body.query || req.headers['x-access-token'];
      if (token) {
         jwt.verify(token, secret, function(err, decoded) {
            if (err) {
               res.json({success: false, message:"Token invalid."});
            } else {
               req.decoded = decoded;
               next();
            }
         });
      } else {
         res.json({success: false, message:"No token provided."});
      }
   });

   // http://localhost:3000/api/users/me
   // USER ME ROUTE //
   router.post('/users/me', function (req, res) {
      res.send(req.decoded);
   });

   return router;
}
