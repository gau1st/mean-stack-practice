angular.module('userController', ['userService'])
   .controller('register', function($location, $timeout, User) {
      var app = this;
      app.regUser = function(regData) {
         app.loading = true;
         app.successMsg = false;
         app.errorMsg = false;
         User.create(app.regData).then(function(data) {
            if (data.data.success) {
               app.loading = false;
               // Create success message
               app.successMsg = data.data.message;
               // Clear the input
               app.regData.email = null;
               app.regData.username = null;
               app.regData.fullname = null;
               app.regData.password = null;
               app.regData.confirmpassword = null;
               // Redirect to homepage
               $timeout(function () {
                  $location.path('/login');
               }, 2000);
            } else {
               app.loading = false;
               // Create on error message
               app.errorMsg = data.data.message;
            }
         });
      }
   })
   .controller('facebook', function($window, $routeParams, $location, Auth) {
      var app = this;
      if ($window.location.pathname == "/facebookerror") {
         app.errorMsg = "Facebook email not found in database."
      } else {
         Auth.facebook($routeParams.token);
         $location.path('/profile');
      }
   });
