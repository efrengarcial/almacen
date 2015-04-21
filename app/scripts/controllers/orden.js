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
        'ordenFactory', 'toaster', '$location', 'Constants', 'accountFactory', '$routeParams',
        function($scope, $log, $rootScope, proveedorFactory, productoFactory, ordenFactory,
            toaster, $location, Constants, accountFactory, $routeParams) {

            $log.debug('Iniciando Orden....' + $location.$$url);
            var tipoOrden, esServicio = false,
                idOrden = $routeParams.idOrden;

            if ($location.path() === '/ordenCompra') {
                $scope.tituloPantalla = 'Orden de Compra';
                tipoOrden = Constants.ORDEN_COMPRA;
            } else if ($location.path() === '/requisicion') {
                $scope.tituloPantalla = 'Requisición';
                $scope.isRequisicion = true;
                tipoOrden = Constants.REQUISICION;
            } else if ($location.path() === '/requisicionServicio') {
                $scope.tituloPantalla = 'Requisición de Servicio';
                $scope.isRequisicion = true;
                esServicio = true;
                tipoOrden = Constants.REQUISICION_SERVICIO;
            } else {
                $scope.tituloPantalla = 'Orden de Servicio';
                tipoOrden = Constants.ORDEN_SERVICIO;
                esServicio = true;
            }


            if (idOrden !== undefined) {
                ordenFactory.getById(idOrden).then(function(orden) {
                    $scope.orden = orden;
                });
            };


            $scope.orden = ordenFactory.getOrdenObject();
            $scope.orden.AddItem();
            $scope.orden.Tipo = tipoOrden;
            $scope.orden.Solicitante = accountFactory.getAuthenticationData().userName;
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
                $scope.orden.Proveedor = proveedorObj;
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
                return productoFactory.queryProdAndSer(search, esServicio).then(function(data) {
                    return data;
                });
            };

            $scope.addProducto = function() {
                $scope.orden.AddItem();
            };

            $scope.clearForm = function() {
                $scope.orden = null;
                $scope.orden = ordenFactory.getOrdenObject();
                $scope.orden.AddItem();
                $scope.orden.Tipo = tipoOrden;
                $scope.ordenForm.$setPristine();
                $scope.orden.Solicitante = accountFactory.getAuthenticationData().userName;
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
                    if ($scope.orden.OrdenItems.length === 0) {
                        toaster.pop('error', 'Operación Fallida', 'Debe ingresar por lo menos un producto/servicio.');
                    }
                    ordenFactory.save($scope.orden).then(function() {
                        toaster.pop('success', 'Operación Exitosa', 'La Orden de Compra fue creada exitosamente.');
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