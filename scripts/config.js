'use strict';
angular.module('customApp')
  .config(function ($routeProvider, customGridProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainController'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
    //you can use provider to override default grid settings
    customGridProvider.defaults.filterable = true;
  });
