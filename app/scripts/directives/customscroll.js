'use strict';
angular.module('customApp')
  .directive('customScroll', function ($rootScope) {
    return {
      restrict: 'EA',
      scope: {
        silent: '='
      },
      link: function postLink(scope, element, attrs) {

        element.bind('scroll', function () {
          var silent = scope.silent;
          if (silent) {
            return;
          }
          var scrollPercentage = 100 * this.scrollTop / (this.scrollHeight - this.clientHeight);
          scrollPercentage = scrollPercentage.toFixed(0);
          $rootScope.$emit('scroll:change',scrollPercentage);
          var reachBottom = $(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight;
          if (reachBottom) {
            $rootScope.$emit('scroll:bottom');
          }
          element.scope().$apply();
        });
      }
    };
  });
