'use strict';

describe('Service: CustomGrid', function () {

  // load the service's module
  beforeEach(module('custom-spinner'));
  beforeEach(module('custom-scroll'));
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('custom-grid'));


  // instantiate service
  var customGrid, defaultOptionsMock, options, element;
  var fakeData;

  function stripGridProps(data) {
    if (!_.isArray(data)) {
      data = [data];
    }
    _.each(data, function (dataItem) {
      _.each(['__uid', '__selected', '__editing'], function (prop) {
        delete dataItem[prop];
      });
    })
  }
  //
  //beforeEach(function () {
  //  defaultOptionsMock = {
  //    pageSize: 10,
  //    virtualization: false,
  //    sortable: true,
  //    filterable: true,
  //    editable: true,
  //    data: [{
  //      Id: '1',
  //      FirstName: 'FirstName',
  //      LastName: 'LastName',
  //      Age: 12,
  //      Email: 'Email'
  //    }]
  //  }
  //});

  //beforeEach(function () {
  //  angular.mock.module(function ($provide) {
  //    $provide.constant('DefaultOptions', defaultOptionsMock);
  //  });
  //});

  beforeEach(inject(function (_customGrid_) {
    customGrid = _customGrid_;
  }));


  beforeEach(function () {
    fakeData = [{
      column1: '21',
      column2: '1'
    }, {
      column1: '11',
      column2: '2'
    }, {
      column1: '31',
      column2: '3'
    }];
    options = {
      pageSize: 10,
      virtualization: false,
      sortable: false,
      filterable: false,
      data: fakeData
    };
  });

  describe('On init', function () {

    xit('should set grid options', function () {
      var grid = new customGrid(options);
      expect(grid._options).not.toBe(options);
      _.each(defaultOptionsMock, function (value, key) {
        expect(grid._options[key]).toEqual(_.isUndefined(options[key]) ? defaultOptionsMock[key] : options[key]);
      });
    });

    xit('should strip wrong options', function () {
      var wrongProps = {'blablabla': 'blablabla'};
      var wrongOptions = _.extend(options, wrongProps);
      var grid = new customGrid(element, wrongOptions);
      expect(grid._options).not.toEqual(jasmine.objectContaining(wrongProps));
    });

    xit('should throw exception when got wrong options', function () {
      options.sortDirection = 'bla';
      expect(function () {
        var grid = new customGrid(element, options);
      }).toThrow();
    });

    _.each(['__uid', '__selected', '__editing'], function (prop) {
      it('should throw exception when dataItem contains ' + prop + ' field', function () {
        options.data[0][prop] = 'abc';
        expect(function () {
          new customGrid(options);
        }).toThrow();
      });
    });

    xit('should set default options', function () {
      var grid = new customGrid({});
      _.each(_.chain(grid._options).keys().without('data'), function (prop) {
        expect(grid._options[prop]).toEqual(defaultOptionsMock[prop]);
      });
    });

    it('should set first page of data as view', function () {
      options.pageSize = 2;
      var grid = new customGrid(options);
      stripGridProps(grid.view);
      expect(grid.page()).toEqual(1);
      expect(grid.view).toEqual(_.slice(fakeData, 0, 2));
    });

    it('should set __uid for every dataItem', function () {
      var grid = new customGrid(options);
      _.each(grid._data, function (value) {
        expect(value.__uid).toBeDefined();
      });
    });
  });

  describe('After init', function () {
    it('should return correct total items number', function () {
      var grid = new customGrid(options);
      expect(grid.total()).toEqual(fakeData.length);
    });

    it('should return correct pristineTotal items number', function () {
      var grid = new customGrid(options);
      expect(grid.pristineTotal()).toEqual(fakeData.length);
    });

    it('should return correct totalPages number', function () {
      options.pageSize = 2;
      var grid = new customGrid(options);
      expect(grid.totalPages()).toEqual(2);
    });

    describe('on filter', function () {
      beforeEach(function() {
        options.filterable = true;
      });
      it('should filter data by column', function() {
        var grid = new customGrid(options);
        grid.filters.column1 = '2';
        grid.filter();
        stripGridProps(grid.view);
        expect(grid.view).toContain(fakeData[0]);
        expect(grid.view.length).toBe(1);
        expect(grid._data.length).toBe(1);
      });

      it('should filter data by several columns', function() {
        var grid = new customGrid(options);
        grid.filters.column1 = '2';
        grid.filters.column2 = '2';
        grid.filter();
        expect(grid.view.length).toBe(0);
        expect(grid._data.length).toBe(0);
      });

      it('should filter by selection', function() {
        var grid = new customGrid(options);
        var selectedItem = _.first(grid._pristineData);
        grid.select(selectedItem);
        grid.filters.__selected = true;
        grid.filter();
        expect(grid.view.length).toBe(1);
        expect(grid._data.length).toBe(1);
      });
    });

    describe('on select', function () {
      beforeEach(function() {
        options.editable = true;
      });
      it('should mark dataItem as selected', function () {
        var grid = new customGrid(options);
        var selected = _.first(options.data);
        grid.select(selected);
        expect(selected.__selected).toBeDefined();
        expect(grid.selected).toContain(selected);
      });

      it('should mark several dataItems as selected', function () {
        var grid = new customGrid(options);
        var selected = [_.first(options.data), _.last(options.data)];
        _.each(selected, function (item) {
          grid.select(item);
        });
        _.each(selected, function (item) {
          expect(item.__selected).toBeDefined();
          expect(grid.selected).toContain(item);
        });
        expect(grid.selected.length).toBe(selected.length);
      });

      it('should not mark dataItem as select when it was unselect', function () {
        var grid = new customGrid(options);
        var selected = _.first(options.data);
        grid.select(selected);
        grid.select(selected);
        expect(selected.__selected).toBeUndefined();
        expect(grid.selected.length).toBe(0)
      });

      it('should clear selection', function() {
        var grid = new customGrid(options);
        var selected = [_.first(options.data), _.last(options.data)];
        _.each(selected, function (item) {
          grid.select(item);
        });
        grid.clearSelection();
        _.each(selected, function (item) {
          expect(item.__selected).toBeUndefined();
        });
        expect(grid.selected.length).toBe(0);
      });
    });

    describe('on sort', function () {
      beforeEach(function() {
        options.sortable = true;
      });

      it('should update sorting property on sort', function () {
        var column = 'column';
        var grid = new customGrid(options);
        expect(grid.sorting.column).toEqual('__uid');
        expect(grid.sorting.direction).toEqual('asc');
        grid.sort(column, 'desc');
        expect(grid.sorting.column).toEqual(column);
        expect(grid.sorting.direction).toEqual('desc');
      });

      _.each(['asc', 'desc'], function (direction) {
        var column = 'column1';
        it('should sort data correctly by ' + direction, function () {
          options.sortColumn = column;
          options.sortDirection = direction;
          var grid = new customGrid(options);
          grid.sort(column, direction);
          if (direction === 'asc') {
            expect(_.first(grid._data)[column] < _.last(grid._data)[column]).toBe(true);
          } else {
            expect(_.first(grid._data)[column] > _.last(grid._data)[column]).toBe(true);
          }
        });
      });
    });

    describe('on paging', function () {

      it('should get and set page in classic paging mode', function () {
        options.pageSize = 2;
        options.virtualization = false;
        var grid = new customGrid(options);
        var page = grid.page();
        expect(page).toEqual(1);
        grid.page(2);
        page = grid.page();
        expect(page).toEqual(2);
      });

      it('should change view when page changed', function () {
        options.pageSize = 2;
        var grid = new customGrid(options);
        var firstPageData = _.slice(fakeData, 0, 2);
        var secondPageData = _.slice(fakeData, 2, 3);
        stripGridProps(grid._data);
        expect(grid.view).toEqual(firstPageData);
        grid.page(2);
        expect(grid.view).toEqual(secondPageData);
      });

      it('should not clear view when virtualization enabled', function () {
        options.virtualization = true;
        options.pageSize = 2;
        var grid = new customGrid(options);
        stripGridProps(grid._data);
        var firstPageData = _.slice(fakeData, 0, 2);
        var secondPageData = _.slice(fakeData, 2, 3);
        grid.page(2);
        expect(grid.view).toEqual(firstPageData.concat(secondPageData));
      });

      it('should throw exception when page number is out of range', function () {
        options.pageSize = 2;
        var grid = new customGrid(options);
        expect(function () {
          grid.page(10);
        }).toThrow();
      });

    });
  });

});
