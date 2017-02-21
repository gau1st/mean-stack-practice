var User = require('../model/user');

module.exports = function(router) {
   // http://localhost:3000/api/users
   router.post('/users', function (req, res) {
      strUsername = req.body.username.replace(/\s+/g, '');
      strPassword = req.body.password.replace(/\s+/g, '');
      strEmail = req.body.email.replace(/\s+/g, '');
      var item = {
         username: strUsername,
         password: strPassword,
         email: strEmail,
      }
      var user = new User(item);

      if (strUsername == null || strUsername == "" || strPassword == null || strPassword == "" || strEmail == null || strEmail == "") {
         res.json({success: false, message:"Ensure username, email and password was provided."});
      } else {
         user.save(function(err){
            if (err) {
               // res.send(err);
               res.json({success: false, message:"Username or Email already exist."});
            } else {
               res.json({success: true, message:"User created."});
            }
         });
      }
   });

   return router;
}
