'use strict';

describe('Controller: SalidaCtrl', function () {

  // load the controller's module
  beforeEach(module('almacenApp'));

  var SalidaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SalidaCtrl = $controller('SalidaCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
