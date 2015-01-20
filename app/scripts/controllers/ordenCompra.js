'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('OrdenCompraCtrl', ['$scope', '$log', 'proveedorFactory', 'productoFactory',
    	'ordenCompraFactory', 
        function($scope, $log, proveedorFactory, productoFactory,ordenCompraFactory) {
            $log.debug('Iniciando Orden....');

            $scope.orden = ordenCompraFactory.getOrdenObject();

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
            	ordenCompraFactory.addOrdenItemObject($scope.orden);	
            }

        }
    ]);