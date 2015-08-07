var angular = require("angular");

angular.module("weatherApp", [require('angular-route')])
.config(function($routeProvider) {

})
    .controller(
	"MainCtrl", 
	["$scope", "$http",
	 function($scope, $http) {
	     $http.get("/services/all-cities.json")
		 .success(function(data) {
		     $scope.stuff = data;
		 })
	 }]);
