'use strict';

angular.module('customApp')
  .factory('CustomGrid', function (DefaultOptions) {

    var CustomGrid = function (options) {
      var that = this;
      var _total = function () {
        return that._data.length;
      };

      var _pristineTotal = function () {
        return that._pristineData.length;
      };

      var _getRanges = function () {
        var ranges = [];
        var total = that.total();
        var pageSize = that._options.pageSize;
        var rangeNum = Math.ceil(total / pageSize);
        for (var i = 0; i < rangeNum; i++) {
          ranges.push({
            from: i * pageSize,
            to: (i + 1) * pageSize,
            data: _.slice(that._data, i * pageSize, (i + 1) * pageSize)
          });
        }
        return ranges;
      };

      var _totalPages = function () {
        return that._ranges.length;
      };

      var _fetchPage = function (page, clean) {
        if (clean === true) {
          that.view.length = 0;
        }
        if (_.isUndefined(page)) {
          page = that.page();
        }
        var range = that._ranges[page - 1];
        if (range && range.from >= that.view.length) {
          Array.prototype.push.apply(that.view, range.data);
        }
      };

      var _fetchPages = function (pages) {
        that.view.length = 0;
        _.each(pages, function (page) {
          _fetchPage(page);
        });
      };

      var _page = function (page) {
        if (!page) {
          return that._page;
        } else {
          if (page > _totalPages()) {
            throw 'Page range error. You try set ' + page + ' page of ' + _totalPages();
          }
          _fetchPage(page, !that.virtualization);
          that._page = page;
        }
      };

      var _sort = function (column, direction) {
        var comparer = function (firstItem, secondItem, direction) {
          var result;
          if (firstItem[column] === secondItem[column]) {
            result = 0;
          } else {
            result = firstItem[column] > secondItem[column] ? 1 : -1;
          }
          if (direction === 'asc') {
            return result;
          } else {
            return -1 * result;
          }
        };

        that._data.sort(_.partialRight(comparer, direction));
        that._ranges = _getRanges();
        if (!that.virtualization) {
          _fetchPage(undefined, true);
        } else {
          _fetchPages(_.range(1, that.page() + 1))
        }
        that.sorting.direction = direction;
        that.sorting.column = column;
      };

      var _filter = function () {

        var filtered = _.filter(that._pristineData, function (dataItem) {
          var result = true;
          _.each(that.filters, function (value, key) {
            if (key === '__selected') {
              result = result && (dataItem[key] === true);
            } else if (key === 'Age') {
              var maxAge = _.last(value.split('-'));
              var minAge = _.first(value.split('-'));
              result = result && (dataItem[key] > minAge && dataItem[key] < maxAge);
            } else {
              if (value && dataItem[key].indexOf(value) === -1) {
                result = false;
              }
            }
          });
          if (result && that.filters.Age) {
            var parts = that.filters.Age.split('-');
            result = dataItem.Age > parts[0] && dataItem.Age < parts[1];
          }
          return result;
        });
        that._data.length = 0;
        Array.prototype.push.apply(that._data, filtered);
        that._ranges = _getRanges();
        that._page = 1;
        that.view.length = 0;
        that.fetchPage();
      };

      var _select = function (dataItem) {
        if (!that._options.editable) {
          return;
        }
        if (_.contains(that.selected, dataItem)) {
          _.pull(that.selected, dataItem);
          delete dataItem.__selected;
        } else {
          that.selected.push(dataItem);
          dataItem.__selected = true;
        }
      };

      var _selectAll = function() {
        _.each(that.view, that.select);
      };

      var _clearSelection = function () {
        _.each(that.selected, function (dataItem) {
          delete dataItem.__selected;
          //delete dataItem.__selected;
        });
        that.selected.length = 0;
        if (that.filters.__selected) {
          that.filter();
        }
      };

      var _remove = function () {
        _.each(that.selected, function (dataItem) {
          _.pull(that._pristineData, dataItem);
        });
        that._data.length = 0;
        Array.prototype.push.apply(that._data, that._pristineData);
        that._ranges = _getRanges();
        if (!that.virtualization) {
          _fetchPage(undefined, true);
        } else {
          _fetchPages(_.range(1, that.page() + 1))
        }
        that.selected.length = 0;
        that._total = that.total();
        that._pristineTotal = that.pristineTotal();
        that.filter();
      };

      var _clearFilter = function (column) {
        that.filters[column] = '';
        that.filter();
      };

      //Public grid API
      //without side effects
      that.totalPages = _totalPages;
      that.total = _total;
      that.getRanges = _getRanges;
      that.pristineTotal = _pristineTotal;

      that.clearFilter = _clearFilter;
      that.clearSelection = _clearSelection;
      that.remove = _remove;
      that.select = _select;
      that.filter = _filter;
      that.sort = _sort;
      that.page = _page;
      that.fetchPage = _fetchPage;
      that.selectAll = _selectAll;

      that.init(options);
    };

    CustomGrid.prototype.init = function (options) {

      var that = this;

      var validateOptions = function (options) {
        var validated = {};
        _.extend(validated, angular.copy(DefaultOptions));
        _.each(options, function (value, key) {
          if (!DefaultOptions.hasOwnProperty(key)) {
            delete options[key];
          }
        });
        _.extend(validated, angular.copy(options));
        //options.data.length = 0;
        return validated;
      };

      var extractColumns = function (data) {
        return data.length ? _.chain(data).first().keys().without('__uid', '__selected', '__editing').value() : [];
      };

      var setupData = function (data) {
        _.each(data, function (dataItem, index) {
          _.each(['__uid', '__selected', '__editing'], function (prop) {
            if (dataItem.hasOwnProperty(prop)) {
              throw 'dataItems should not contain ' + prop + ' property';
            }
          });
          dataItem.__uid = index;
        });
      };

      //private grid properties
      that._options = validateOptions(options);
      that._pristineData = that._options.data;
      that._data = that._pristineData.slice();
      that._ranges = that.getRanges();
      that._total = that.total();
      that._pristineTotal = that.pristineTotal();
      that._pageSize = that._options.pageSize;
      that._page = 1;

      //public grid properties
      that.selected = [];
      that.filters = {};
      that.sorting = {
        column: '__uid',
        direction: 'asc'
      };
      that.paging = {
        pageSize: that._pageSize
      };
      that.view = [];
      that.virtualization = that._options.virtualization;
      that.columns = extractColumns(that._pristineData);

      if (!that.columns.length) {
        that.columns = that._options.columns || [];
      }
      if (!that.columns.length) {
        throw 'You must specified dataItems or columns!';
      }
      setupData(that._pristineData);
      that.fetchPage(1);
    };
    return CustomGrid;
  });
