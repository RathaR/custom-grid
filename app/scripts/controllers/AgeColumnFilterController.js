'use strict';
angular.module('customApp')
  .controller('AgeColumnFilterController', function ($scope) {
    $scope.ages = [{
      name: '10-20',
      value: '10-20'
    }, {
      name: '20-30',
      value: '20-30'
    }, {
      name: '30-40',
      value: '30-40'
    }, {
      name: '40+',
      value: '40-9999'
    }];
  });
