'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ProveedorCtrl', ['$scope', '$log', '$rootScope', 'proveedorFactory', 'toaster', '$filter',
        'modalWindowFactory',
        function($scope, $log, $rootScope, proveedorFactory, toaster, $filter, modalWindowFactory) {
            $log.debug('Iniciando orden proveedores...');

            $scope.clearForm = function() {
                $scope.proveedor = null;
                // Resets the form validation state.
                //https://github.com/angular/angular.js/issues/10006
                //https://docs.angularjs.org/api/ng/type/form.FormController
                $scope.proveedorForm.$setPristine();
                // Broadcast the event to also clear the grid selection.
                $rootScope.$broadcast('clear');
                console.log("clear");
            };


            $scope.submitForm = function(isValid) {
                $log.debug(isValid);
                if (isValid) {
                    proveedorFactory.saveProveedor($scope.proveedor).then(function(mensaje) {
                        toaster.pop('success', 'mensaje', 'El proveedor fue creado exitosamente.')
                        $scope.clearForm();
                    }, function error(response) {
                        // An error has occurred
                        $rootScope.$emit('evento', {
                            descripcion: response.statusText
                        });
                    });
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

        }
    ]);