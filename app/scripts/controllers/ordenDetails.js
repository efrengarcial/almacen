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
            var tipoPantalla = null,
                idOrden = $routeParams.idOrden;

            if ($location.path() === '/ordenDetails') {
                $scope.tituloPantalla = 'Detalles del Producto';
            }

            if (idOrden !== null) {
                ordenFactory.getById(idOrden).then(function(orden) {
                    $scope.orden = orden;
                    $scope.truefalse = true;
                    $scope.orden.params = $routeParams;

                    //Set FechaEntrega
                    var date = moment($scope.orden.FechaOrden, Constants.formatDate);
                    date.add($scope.orden.Proveedor.Plazo, 'days');
                    $scope.orden.FechaEntrega = moment(date).format(Constants.formatDate);
                });
            }

            //From here you can back to consultaOrden
            $scope.backBuscarOrden = function() {
                $location.path("/consultarOrden").search($scope.orden.params);
            }
        }
    ]);
