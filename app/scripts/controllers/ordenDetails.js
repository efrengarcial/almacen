'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:OrdenDetailsCtrl
 * @description
 * # OrdenDetailsCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('OrdenDetailsCtrl', ['$scope', '$log', '$rootScope', 'proveedorFactory', 'productoFactory',
        'ordenFactory', 'modalWindowFactory', 'toaster', '$location', 'Constants', 'accountFactory', '$routeParams', 'moment',
        function($scope, $log, $rootScope, proveedorFactory, productoFactory, ordenFactory, modalWindowFactory,
            toaster, $location, Constants, accountFactory, $routeParams, moment) {

            $log.debug('Iniciando ordenDetails...');
            var tipoPantalla = null, idOrden = $routeParams.idOrden;

            if ($location.path() === '/ordenDetails') {
                $scope.tituloPantalla = 'Detalles de la Orden';
            }

            //Get FechaEntrega
            $scope.getFechaEntrega = function() {
                var fecha = moment($scope.orden.FechaOrden, Constants.formatDate).format(Constants.formatDate2);;
                var plazo = $scope.orden.Proveedor.Plazo;

                return ordenFactory.getFechaEntrega(plazo, fecha).then(function(data) {
                    if (data.length > 0) {
                        $scope.orden.FechaEntrega = moment(data[0].Fecha).format(Constants.formatDate);
                    } else {
                        toaster.pop('warning', 'NO HAY FECHA DE ENTREGA', 'No existe calendario para la fecha descrita');
                    }
                });
            };

            //From here you can back to consultaOrden
            $scope.backBuscarOrden = function() {
                $location.path("/consultarOrden").search($scope.orden.params);
            };

            if (idOrden) {
                ordenFactory.getById(idOrden).then(function(orden) {
                    $scope.orden = orden;
                    $scope.consultaOrden.ReadOnly = true;
                    $scope.orden.params = $routeParams;
                    $scope.getFechaEntrega();
                });
            }
        }
    ]);
