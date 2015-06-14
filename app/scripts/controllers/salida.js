'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:SalidasCtrl
 * @description
 * # SalidasCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('SalidaCtrl', ['$scope', '$log', '$rootScope', 'salidaFactory', 'proveedorFactory', 'productoFactory', 'toaster',
        '$location', 'Constants', 'accountFactory', '$routeParams', 'moment',
        function($scope, $log, $rootScope, salidaFactory, proveedorFactory, productoFactory, toaster, $location, Constants, accountFactory, $routeParams, moment) {
            $log.debug('Iniciando Salida....');
            var esServicio = false;

            $scope.salida = salidaFactory.getSalidaObject();
            $scope.salida.AddItem();

            /* Cargar información de listas */
            $scope.proveedores = [];

            function cargarProveedores() {
                proveedorFactory.getAll().then(function(proveedores) {
                    $scope.proveedores = proveedores;
                });
            }

            function setFechaEntrega() {
                var date = moment($scope.salida.Fecha, Constants.formatDate);
                date.add($scope.salida.Proveedor.Plazo, 'days');
                $scope.salida.FechaEntrega = moment(date).format(Constants.formatDate);
            }

            cargarProveedores();

            function saveProveedor(proveedorObj, model, label) {
                $log.debug('label ' + label);
                $log.debug('model ' + JSON.stringify(model));
                $scope.salida.IdProveedor = proveedorObj.Id;
                $scope.salida.Proveedor = proveedorObj;
                setFechaEntrega();

            }

            function saveProducto(productoObj, model, label, ordenItemObj) {
                $log.debug('label ' + label);
                $log.debug('model ' + JSON.stringify(productoObj));
                ordenItemObj.Producto = productoObj;
            }
            
            function saveOrden(ordenObj, model, label, ordenItemObj) {
                $log.debug('label ' + label);
                $log.debug('model ' + JSON.stringify(ordenObj));
                ordenItemObj.Orden = ordenObj;
            }

            $scope.saveProveedor = saveProveedor;
            $scope.saveProducto = saveProducto;

            $scope.getProductos = function(search) {
                $log.debug('Buscando productos......');
                return productoFactory.queryProdAndSer(search, esServicio).then(function(data) {
                    return data;
                });
            };
            
            $scope.getOrdenes = function(search) {
                $log.debug('Buscando centro de costos...');
                return productoFactory.queryProdAndSer(search, esServicio).then(function(data) {
                    return data;
                });
            };

            $scope.addItem = function() {
                $scope.salida.AddItem();
            };

            $scope.removeProduct = function(index) {
                $scope.salidaForm.$setPristine();
                $scope.salida.removeItem(index);
            };

            $scope.clearForm = function() {
                $scope.salida = null;
                $scope.salida = salidaFactory.getSalidaObject();
                $scope.salida.AddItem();
                $scope.salidaForm.$setPristine();
                $scope.salida.Solicitante = accountFactory.getAuthenticationData().userName;
                // Broadcast the event to also clear the grid selection.
                //$rootScope.$broadcast('clear');
            };

            $scope.interacted = function(field) {
                return field.$dirty;
            };

            $scope.showMessage = function() {
                $('.required-icon, .required-combo-icon').tooltip({
                    placement: 'left',
                    title: 'Campo requerido'
                });
            };


            $scope.save = function() {
                $log.debug('save');
            };

        }
    ]);
