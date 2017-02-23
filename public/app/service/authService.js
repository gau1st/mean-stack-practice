angular.module('authService', [])
   .factory('Auth', function($http, AuthToken) {
      var authFactory = {};

      // Auth.login(loginData)
      authFactory.login = function(loginData) {
         return $http.post('api/users/auth', loginData).then(function(data) {
            if (data.data.token != null) {
               AuthToken.setToken(data.data.token);
            }
            return data;
         });
      };

      // Auth.logout()
      authFactory.logout = function() {
         AuthToken.setToken();
      };

      // Auth.getUser(loginData)
      authFactory.getUser = function(userData) {
         if (AuthToken.getToken()) {
            return $http.post('api/users/me');
         } else {
            $q.reject({message: 'User has no token.'});
         }
      };

      // Auth.isLoggedIn()
      authFactory.isLoggedIn = function(loginData) {
         if (AuthToken.getToken()) {
            return true;
         } else {
            return false;
         }
      };

      // Auth.facebook(token)
      authFactory.facebook = function(token) {
         AuthToken.setToken(token);
      };

      return authFactory;
   })

   .factory('AuthToken', function($window) {
      var authTokenFactory = {};

      // AuthToken.setToken(token)
      authTokenFactory.setToken = function(token) {
         if (token) {
            $window.localStorage.setItem('token', token);
         } else {
            $window.localStorage.removeItem('token');
         }
      };

      // AuthToken.getToken()
      authTokenFactory.getToken = function() {
         return $window.localStorage.getItem('token');
      };

      return authTokenFactory;
   })
   .factory('AuthInterceptor', function(AuthToken) {
      var authInterceptorFactory = {};

      // AuthInterceptor.request(config)
      authInterceptorFactory.request = function(config) {
         var token = AuthToken.getToken();
         if (token) {
            config.headers['x-access-token'] = token;
         }
         return config;
      };

      return authInterceptorFactory;
   });
