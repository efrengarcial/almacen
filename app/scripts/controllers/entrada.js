'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:EntradaCtrl
 * @description
 * # EntradaCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('EntradaCtrl', ['$scope', '$log', '$rootScope', 'ordenFactory', 'toaster',
        '$location', 'Constants', '$routeParams', 'moment',
        function($scope, $log, $rootScope, ordenFactory, toaster, $location, Constants, $routeParams, moment) {
            $log.debug('Iniciando Entrada....' + $location.$$url);

            var idOrden = $routeParams.idOrden;

            $scope.getFechaEntrega = function() {
                var fecha = moment($scope.orden.FechaOrden, Constants.formatDate).format(Constants.formatDate2);
                var plazo = $scope.orden.Proveedor.Plazo;
                return ordenFactory.getFechaEntrega(plazo, fecha).then(function(data) {
                    if (data.length > 0) {
                        $scope.orden.FechaEntrega = moment(data[0].Fecha).format(Constants.formatDate);
                    } else {
                        toaster.pop('warning', 'NO HAY FECHA DE ENTREGA', 'No existe calendario para la fecha descrita');
                    }
                });
            }

            $scope.interacted = function(field) {
                return $scope.submitted || field.$dirty;
            };

            $scope.showMessage = function() {
                $('.required-icon, .required-combo-icon').tooltip({
                    placement: 'left',
                    title: 'Campo requerido'
                });
            };

            $scope.save = function(isValid) {
                if (isValid) {
                    ordenFactory.saveEntrada($scope.orden).then(function() {
                        toaster.pop('success', 'Operación Exitosa', 'La Entrada fue registrada exitosamente.');
                        $location.path("/entradas");
                    }, function error(response) {
                        // An error has occurred
                        $rootScope.$emit('evento', {
                            descripcion: response.statusText
                        });
                    });
                }
            };

            $scope.backOrdenesEntradas = function() {
                $location.path("/entradas");
            };

            if (idOrden) {
                ordenFactory.getById(idOrden).then(function(orden) {
                    $scope.orden = orden;
                    //Get Fecha Entrega
                     $scope.getFechaEntrega();
                });
            }
        }
    ]);
