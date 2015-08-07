var angular = require("angular");

angular.module("weatherApp", [require('angular-route')])
    .config(function($routeProvider, $locationProvider) {
	$routeProvider
	    .when('/', {
		templateUrl: "partials/main.html",
		controller: "MainCtrl"
	    })
	    .when('/city/:cityName', {
		templateUrl: "partials/detail.html",
		controller: "DetailCtrl"
	    })
	    .otherwise({redirectTo: "/"})
	// works better with html5 mode, but that requires server side setup,
	// or at least a custom 404 page on GitHub Pages.
	// $locationProvider.html5Mode(true);
    })
    .factory("weatherSvc", ["$http", "$q", function($http, $q) {
	var all_cities = {};
	var get_summary = $q(function(resolve, reject) {
	    $http.get("/services/all-cities.json")
		.success(function(data) {
		    resolve(data);
		})
	});
	var get_detail = function(url) {
	    return $q(function(resolve, reject) {
		$http.get(url)
		    .success(function(data) {
			resolve(data);
		    })
	    })
	}
	    
	return function(city_name) {
	    var container = {}
	    if (typeof city_name === "undefined") {
		get_summary.then(function(data) {
		    container.data = data
		});
	    } else {
		get_summary.then(function(data) {
		    for (idx in data) {
			if ( city_name === data[idx].city ) {
			    console.log(city_name);
			    get_detail(data[idx].detailsSvc).then(function(detail) {
				container.data = detail;
			    })
			}
		    }
		});
	    }
	    return container;
	}
    }])
    .controller(
	"MainCtrl", 
	["$scope", "weatherSvc",
	 function($scope, weatherSvc) {
	     $scope.summary = weatherSvc();
	 }])
    .controller(
	"DetailCtrl",
	["$scope", "$route", "weatherSvc",
	 function($scope, $route, weatherSvc) {
	     var cityName = $route.current.params.cityName;
	     $scope.detail = weatherSvc(cityName);
	 }])
