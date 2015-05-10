'use strict';
angular.module('customApp')
  .controller('MainController', function ($scope, DemoDataGenerator, $interval) {
    $scope.itemsCount = 300;
    var options = {
      pageSize: 50,
      data: DemoDataGenerator.get($scope.itemsCount),
      virtualization: false,
      sortable: true,
      filterable: true,
      editable: true
    };
    $scope.options = options;
    $scope.applySettings = applySettings;
    function applySettings() {
      delete options.data;
      options.data = DemoDataGenerator.get($scope.itemsCount);
      $scope.$broadcast('grid:rebind', options);
    }

    $interval(function () {
      $scope.watchersCount = getWatcherCounts();
    }, 1000);

    /// Get from http://stackoverflow.com/questions/18499909/how-to-count-total-number-of-watches-on-a-page
    function getWatcherCounts() {
      var root = angular.element(document.getElementsByTagName('body'));

      var watchers = [];

      var f = function (element) {
        angular.forEach(['$scope', '$isolateScope'], function (scopeProperty) {
          if (element.data() && element.data().hasOwnProperty(scopeProperty)) {
            angular.forEach(element.data()[scopeProperty].$$watchers, function (watcher) {
              watchers.push(watcher);
            });
          }
        });

        angular.forEach(element.children(), function (childElement) {
          f(angular.element(childElement));
        });
      };

      f(root);

      // Remove duplicate watchers
      var watchersWithoutDuplicates = [];
      angular.forEach(watchers, function (item) {
        if (watchersWithoutDuplicates.indexOf(item) < 0) {
          watchersWithoutDuplicates.push(item);
        }
      });
      return watchersWithoutDuplicates.length;
    }
  });
