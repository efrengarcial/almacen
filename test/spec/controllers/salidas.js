'use strict';

describe('Controller: SalidasCtrl', function () {

  // load the controller's module
  beforeEach(module('almacenApp'));

  var SalidasCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalidasCtrl = $controller('SalidasCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
