'use strict';
angular.module('custom-grid')
  .controller('PagingController', function ($scope, $rootScope) {
    var grid;
    $scope.$on('grid:init', function (event, gridInstance) {
      grid = gridInstance;
      $scope.currentPage = grid.page();
    });
    $rootScope.$on('scroll:change', function (event, scrollPercentage) {
      var currentViewedItemIndex = (grid.view.length * scrollPercentage / 100).toFixed(0);
      var page = Math.floor(currentViewedItemIndex / grid.paging.pageSize) + 1;
      if (page !== grid._page && page <= grid.totalPages()) {
        grid.page(page);
      }
    });
    $rootScope.$on('scroll:bottom', function (event) {
      grid.fetchPage();
    });
  });
