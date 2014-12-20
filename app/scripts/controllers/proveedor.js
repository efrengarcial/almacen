'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ProveedorCtrl', ['$scope', '$log', '$rootScope', 'productoFactory', 'toaster', '$filter',
        'modalWindowFactory',
        function($scope, $log, $rootScope, productoFactory, toaster, $filter, modalWindowFactory) {
        $log.debug('Iniciando orden proveedores...');

        $scope.submit = function(isValid) {
            $log.debug(isValid);
            if (isValid) {
                alert('Ok');
            }

        };

        $scope.interacted = function(field) {
            return $scope.submitted || field.$dirty;
        };

        $scope.showMessage = function() {
            $('.required-icon, .required-combo-icon').tooltip({
                placement: 'left',
                title: 'Campo requerido'
            });
        };

    }]);