angular.module('userController', [])
   .controller('register', function($http) {
      this.regUser = function(regData) {
         console.log("Data Submitted");
         $http.post("api/users", this.regData).then(function(data) {
            console.log(data);
         });
      }
   });
