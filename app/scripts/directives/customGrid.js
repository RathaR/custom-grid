'use strict';
angular.module('customApp')
  .directive('customGrid', function () {
    return {
      templateUrl: 'views/customGridTemplate.html',
      restrict: 'EA',
      controller: 'CustomGridController',
      scope: true,
      compile: function(el) {
        //may need implement template recompiling, and use one-time binding  for higher perfomance
        var template = el.html();
        return function link(scope, element, attrs) {
          var options = scope.options;
          scope.element = element;
          scope.initGrid(options, element);
        }
      }
    };
  });
