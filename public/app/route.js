var app = angular.module('appRoute', ['ngRoute'])
   .config(function($routeProvider, $locationProvider) {

      $routeProvider
      .when('/', {
         templateUrl: "app/view/page/home.html"
      })
      .when('/about', {
         templateUrl: "app/view/page/about.html"
      })
      .when('/profile', {
         templateUrl: "app/view/page/user/profile.html",
         authenticated: true
      })
      .when('/register', {
         templateUrl: "app/view/page/user/register.html",
         controller: "register",
         controllerAs: "register",
         authenticated: false
      })
      .when('/login', {
         templateUrl: "app/view/page/user/login.html",
         authenticated: false
      })
      .when('/logout', {
         templateUrl: "app/view/page/user/logout.html",
         authenticated: true
      })
      .when('/facebook/:token', {
         templateUrl: "app/view/page/user/social/social.html",
         controller: "facebook",
         controllerAs: "facebook",
         authenticated: false
      })
      .when('/facebookerror', {
         templateUrl: "app/view/page/user/login.html",
         controller: "facebook",
         controllerAs: "facebook",
         authenticated: false
      })
      .otherwise({
         redirectTo: "/"
      });

      $locationProvider
      .html5Mode({
         enabled: true,
         requireBase: false
      });

});

// Restricting Routes For Authentication
app.run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {
   $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (next.$$route.authenticated == true) {
         if (!Auth.isLoggedIn()) {
            event.preventDefault();
            $location.path("/");
         }
      } else if (next.$$route.authenticated == false) {
         if (Auth.isLoggedIn()) {
            event.preventDefault();
            $location.path("/profile");
         }
      }
   });
}]);
