'use strict';
angular.module('customApp')
  .controller('EditModalController', function ($scope, dataItem) {
    $scope.dataItem = angular.copy(dataItem);
    $scope.columns = extractColumns(dataItem);
    $scope.saveChanges = saveChanges;


    function saveChanges() {
      _.each($scope.columns, function (column) {
        dataItem[column] = $scope.dataItem[column];
      });
      dataItem['Age'] = parseInt(dataItem['Age'], 10);
      $scope.$close();
    }

    function extractColumns(dataItem) {
      return _.chain(dataItem).keys().without('__uid', '__selected').value();
    }
  });
