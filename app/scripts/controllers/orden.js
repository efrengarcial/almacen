'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('OrdenCtrl', ['$scope', '$log', '$rootScope', 'proveedorFactory', 'productoFactory',
        'ordenFactory', 'toaster','$location','Constants',
        function($scope, $log, $rootScope, proveedorFactory, productoFactory, ordenFactory, 
            toaster,$location,Constants) {
            $log.debug('Iniciando Orden....');
            var tipoOrden;

            if ($location.$$url === '/ordenCompra') {
                $scope.tituloPantalla = 'Orden de Compra';
                $scope.isOrdenCompra = true; 
                tipoOrden= Constants.ORDEN_COMPRA;       
            } else if ($location.$$url === '/requisicion') {
                $scope.tituloPantalla = 'Requisición';
                $scope.isRequisicion = true;  
                tipoOrden= Constants.REQUISICION;      
            } else {
                $scope.tituloPantalla = 'Orden de Servicio';
                $scope.isOrdenServicio = true;
                tipoOrden= Constants.ORDEN_SERVICIO;      
            }

            $scope.orden = ordenFactory.getOrdenObject();
            $scope.orden.Tipo = tipoOrden;
            $scope.proveedores = [];

            /* Cargar información de listas */
            function cargarProveedores() {
                proveedorFactory.getAll().then(function(proveedores) {
                    $scope.proveedores = proveedores;
                });
            }

            function saveProveedor(proveedorObj, model, label) {
                $log.debug('label ' + label);
                $log.debug('model ' + JSON.stringify(model));
                $scope.orden.IdProveedor = proveedorObj.Id;
                $scope.proveedor = proveedorObj;
            }

            function saveProducto(productoObj, model, label, ordenItemObj) {
                $log.debug('label ' + label);
                $log.debug('model ' + JSON.stringify(model));
                ordenItemObj.Producto = productoObj;
            }

            $scope.saveProveedor = saveProveedor;
            $scope.saveProducto = saveProducto;
            cargarProveedores();

            $scope.showMessage = function() {
                $('.required-icon, .required-combo-icon').tooltip({
                    placement: 'left',
                    title: 'Campo requerido'
                });
            };

            $scope.getProductos = function(search) {
                $log.debug('Buscando productos......');
                return productoFactory.query(search).then(function(data) {
                    return data;
                });
            };

            $scope.addProducto = function() {
                ordenFactory.addOrdenItemObject($scope.orden);
            };

            $scope.clearForm = function() {
                $scope.orden = null;
                $scope.orden = ordenFactory.getOrdenObject();
                $scope.ordenForm.$setPristine();
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

            $scope.save = function(isValid) {
                if (isValid) {
                    ordenFactory.save($scope.orden).then(function() {
                        toaster.pop('success', 'mensaje', 'La Orden de Compra fue creada exitosamente.');
                        $scope.clearForm();
                    }, function error(response) {
                        // An error has occurred
                        $rootScope.$emit('evento', {
                            descripcion: response.statusText
                        });
                    });
                }
            };

        }
    ]);