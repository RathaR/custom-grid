'use strict';
angular.module('customApp')
  .controller('CustomGridController', function ($scope, CustomGrid, $modal) {
    var grid;

    $scope.initGrid = $scope.withSpinner(init);
    $scope.$on('grid:rebind', function (event, options) {
      $scope.initGrid(options);
    });

    $scope.editModal = editModal;
    $scope.editInline = editInline;
    $scope.rejectInlineChanges = rejectInlineChanges;
    $scope.saveInlineChanges = saveInlineChanges;

    function init(options) {
      $scope.grid = grid = new CustomGrid(options);
      $scope.element.data('custom-grid', grid);
      $scope.$broadcast('grid:init', grid);
      $scope.sort = $scope.withSpinner(sort);
      $scope.filter = $scope.withSpinner(filter);
      $scope.page = $scope.withSpinner(page);
      $scope.remove = $scope.withSpinner(remove);
    }

    function remove() {
      grid.remove();
    }

    function page(pageNum) {
      grid.page(pageNum);
    }

    function filter() {
      grid.filter();
    }

    function sort(column, event) {
      if (!grid._options.sortable) {
        event.stopPropagation();
        return;
      }
      var direction;
      if (grid.sorting.column === column) {
        direction = grid.sorting.direction === 'asc' ? 'desc' : 'asc';
      } else {
        direction = 'asc';
      }
      grid.sort(column, direction);
    }

    $scope.filterBySelection = filterBySelection;

    function filterBySelection() {
      if (_.isUndefined(grid.filters.__selected)) {
        grid.filters.__selected = true;
      } else {
        delete grid.filters.__selected;
      }
      $scope.filter();
    }

    function editModal(dataItem, event) {
      event.stopPropagation();
      var modalOptions = {
        templateUrl: "views/editModal.html",
        scope: $scope,
        controller: 'EditModalController',
        size: 'sm',
        resolve: {
          dataItem: function () {
            return dataItem;
          }
        }
      };
      $modal.open(modalOptions);
    }

    function editInline(dataItem, event) {
      event.stopPropagation();
      dataItem.__editing = {};
      //memorize original values
      _.each(grid.columns, function (column) {
        dataItem.__editing[column] = dataItem[column];
      });
    }

    function rejectInlineChanges(dataItem, event) {
      event.stopPropagation();
      delete dataItem.__editing;
    }

    function saveInlineChanges(dataItem, event) {
      event.stopPropagation();

      //apply changes
      _.each(grid.columns, function (column) {
        dataItem[column] = dataItem.__editing[column];
      });
      delete dataItem.__editing;
    }
  });
