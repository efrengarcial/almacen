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
  	$log.debug('Iniciando Productos...');
    $scope.nombre="";

    $scope.submit = function(isValid) {
    	$log.debug(isValid);
    	if (isValid) {
    		alert('Ok');	
    	}
       	
      };

    $scope.buscar = function() {
       	$log.debug('xxxxxxxx......');
      };

  });
