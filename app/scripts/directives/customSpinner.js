'use strict';
angular.module("customApp")
  .directive('customSpinner', function ($timeout) {

    return {
      priority: 600,
      controller: function ($scope, $element) {

        var spinnerTemplate = '<div class="loading-bar-spinner"><div class="spinner-icon"></div></div>';
        var spinnerElement = angular.element(spinnerTemplate);

        var count = 0;

        $scope.spinnerStart = function () {
          count++;
          $element.append(spinnerElement);
        };

        $scope.spinnerStop = function () {
          count--;
          if (count === 0) {
            spinnerElement.detach();
          }
        };

        $scope.withSpinner = function (invokeFn) {
          return function () {
            $scope.spinnerStart();
            try {
              invokeFn.apply(null, arguments);
            }
            finally {
              $timeout($scope.spinnerStop, 2000);
            }
          };
        };
      }
    };

  });
