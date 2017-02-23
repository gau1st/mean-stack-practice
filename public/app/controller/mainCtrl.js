angular.module('mainController', ['authService'])
   .controller('main', function($window, $location, $timeout, Auth, $rootScope) {
      var app = this;

      app.loadMe = false;

      $rootScope.$on('$routeChangeStart', function() {
         if (Auth.isLoggedIn()) {
            //console.log("User Logged In");
            app.isLoggedIn= true;
            Auth.getUser().then(function(data){
               //console.log(data);
               if (data.data.username != null) {
                  app.username = data.data.username;
                  app.fullname = data.data.fullname;
                  app.email = data.data.email;
                  app.loadMe = true;
               } else {
                  Auth.logout();
                  $location.path('/logout');
                  $timeout(function () {
                     $location.path('/');
                  }, 2000);
               }
            });
         } else {
            //console.log("User Not Logged In");
            app.isLoggedIn= false;
            app.username = "";
            app.email = "";
            app.loadMe = true;
         }
         if ($location.hash('#_=_')) $location.hash(null);
      });

      this.facebook = function() {
         $window.location = $window.location.protocol + "//" + $window.location.host + "/auth/facebook";
      }

      this.doLogin = function(loginData) {
         app.loading = true;
         app.successMsg = false;
         app.errorMsg = false;
         Auth.login(app.loginData).then(function(data) {
            if (data.data.success) {
               app.loading = false;
               // Create success message
               app.successMsg = data.data.message;
               // Clear the Input
               app.loginData.username = '';
               app.loginData.password = '';
               // Redirect to homepage
               $timeout(function () {
                  $location.path('/');
                  app.successMsg = false;
               }, 2000);
            } else {
               app.loading = false;
               // Create on error message
               app.errorMsg = data.data.message;
            }
         });
      };
      this.logout = function() {
         Auth.logout();
         $location.path('/logout');
         $timeout(function () {
            $location.path('/');
         }, 2000);
      };
   });
