angular.module('userApp', ['appRoute', 'mainController', 'userController', 'ngAnimate'])
   .config(function($httpProvider) {
      $httpProvider.interceptors.push('AuthInterceptor');
   })
;
