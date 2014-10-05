'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
  .controller('ProductosCtrl', function ($scope,$log) {
  	$log.debug('ddd');
    $scope.nombre="";

    $scope.submit = function() {
       	$log.debug('yyyyyyyyyy......');
      };

    $scope.buscar = function() {
       	$log.debug('xxxxxxxx......');
      };
  

  });
