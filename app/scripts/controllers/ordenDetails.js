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

            $log.debug('Iniciando ordenDetails: ' + $location.$$url);
            var tipoPantalla = null;

            var idOrden = $routeParams.idOrden;

            if ($location.path() === '/ordenDetails') {
                $scope.tituloPantalla = 'Detalles del Producto';
            }

            if (idOrden !== undefined) {
                ordenFactory.getById(idOrden).then(function(orden) {
                    $scope.orden = orden;
                    $scope.truefalse = true;

                    //Set Fecha Entrega
                    var date = moment($scope.orden.FechaOrden, Constants.formatDate);
                    date.add($scope.orden.Proveedor.Plazo, 'days');
                    $scope.orden.FechaEntrega = moment(date).format(Constants.formatDate);
                    $log.debug($scope.orden);

                    //Remove tr in table
                    $log.debug($scope.orden.OrdenItems);
                });
            }
        }
    ]);