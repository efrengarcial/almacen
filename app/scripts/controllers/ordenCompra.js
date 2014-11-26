'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('OrdenCompraCtrl', function($scope, $log) {
        $log.debug('Iniciando orden compra...');

        $scope.showMessage = function() {
            $('.required-icon, .required-combo-icon').tooltip({
                placement: 'left',
                title: 'Campo requerido'
            });
        };        

    });