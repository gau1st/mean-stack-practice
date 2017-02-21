angular.module('userController', ['userService'])
   .controller('register', function($location, $timeout, User) {
      var app =this;
      app.regUser = function(regData) {
         app.loading = true;
         app.successMsg = false;
         app.errorMsg = false;
         User.create(app.regData).then(function(data) {
            if (data.data.success) {
               app.loading = false;
               // Create success message
               app.successMsg = data.data.message;
               // Redirect to homepage
               $timeout(function () {
                  $location.path('/');
               }, 2000);
            } else {
               app.loading = false;
               // Create on error message
               app.errorMsg = data.data.message;
            }
         });
      }
});
