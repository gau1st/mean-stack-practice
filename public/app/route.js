angular.module('appRoute', ['ngRoute'])
   .config(function($routeProvider, $locationProvider) {

      $routeProvider
      .when('/', {
         templateUrl: "app/view/page/home.html"
      })
      .when('/about', {
         templateUrl: "app/view/page/about.html"
      })
      .when('/register', {
         templateUrl: "app/view/page/user/register.html",
         controller: "register",
         controllerAs: "register"
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
