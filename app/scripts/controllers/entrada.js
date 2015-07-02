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
            ordenFactory.getById(idOrden).then(function(orden) {
                $scope.orden = orden;
                //Set Fecha Entrega
                setFechaEntrega();

            });

            function setFechaEntrega() {
                var date = moment($scope.orden.FechaOrden, Constants.formatDate);
                date.add($scope.orden.Proveedor.Plazo, 'days');
                $scope.orden.FechaEntrega = moment(date).format(Constants.formatDate);
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
                    ordenFactory.save($scope.orden).then(function() {
                        toaster.pop('success', 'Operación Exitosa', 'La Entrada fue regitrada exitosamente.');
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
        }
    ]);
