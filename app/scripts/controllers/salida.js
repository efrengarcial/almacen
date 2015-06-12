'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:SalidasCtrl
 * @description
 * # SalidasCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('SalidaCtrl', ['$scope', '$log', '$rootScope', 'ordenFactory', 'proveedorFactory', 'toaster',
        '$location', 'Constants', '$routeParams', 'moment',
        function($scope, $log, $rootScope, ordenFactory, proveedorFactory, toaster, $location, Constants, $routeParams, moment) {
            $log.debug('Iniciando Salida....');

/*            var salida = {
                FechaEntrega: moment().format(Constants.formatDate)
            };*/

            $scope.salida = ordenFactory.getOrdenObject();
            $log.debug('salida object: ' + $scope.salida.FechaOrden);
            $scope.salida.AddItem();

            //$scope.salida = salida;


            /* Cargar información de listas */
            $scope.proveedores = [];

            function cargarProveedores() {
                proveedorFactory.getAll().then(function(proveedores) {
                    $scope.proveedores = proveedores;
                });
            }

            cargarProveedores();

            function saveProveedor(proveedorObj, model, label) {
                $log.debug('label ' + label);
                $log.debug('model ' + JSON.stringify(model));
                $scope.salida.IdProveedor = proveedorObj.Id;
                $scope.salida.Proveedor = proveedorObj;

            }

            function saveProducto(productoObj, model, label, ordenItemObj) {
                $log.debug('label ' + label);
                $log.debug('model ' + JSON.stringify(model));
                ordenItemObj.Producto = productoObj;
            }

            $scope.saveProveedor = saveProveedor;
            $scope.saveProducto = saveProducto;

            $scope.addItem = function() {
                $scope.salida.AddItem();
            };

            $scope.save = function() {
                $log.debug('save');
            };
        }
    ]);
