'use strict';

xdescribe('Controller: CustomgridcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('customApp'));

  var CustomgridcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CustomgridcontrollerCtrl = $controller('CustomgridcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
