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
        'ordenFactory', 'salidaFactory', 'modalWindowFactory', 'toaster', '$location', 'Constants', 'accountFactory', '$routeParams', 'moment',
        function($scope, $log, $rootScope, proveedorFactory, productoFactory, ordenFactory, salidaFactory, modalWindowFactory,
            toaster, $location, Constants, accountFactory, $routeParams, moment) {

            $log.debug('Iniciando orden: ' + $location.$$url);
            $scope.saveAndCloseClick = false;
            var tipoOrden, esServicio = false, ordenId = null;
            $scope.max = Constants.plazoMax, $scope.min = Constants.plazoMin;

            if ($routeParams.idOrden) {
                ordenId = $routeParams.idOrden;
            }

            if ($location.path() === '/ordenCompra') {
                $scope.tituloPantalla = 'Orden de Compra';
                tipoOrden = Constants.ORDEN_COMPRA;
            }

            if ($location.path() === '/requisicion') {
                $scope.tituloPantalla = 'Requisición';
                $scope.isRequisicion = true;
                tipoOrden = Constants.REQUISICION;
            }

            if ($location.path() === '/requisicionServicio') {
                $scope.tituloPantalla = 'Requisición de Servicio';
                $scope.isRequisicion = true;
                esServicio = true;
                tipoOrden = Constants.REQUISICION_SERVICIO;
            }

            if ($location.path() === '/ordenServicio') {
                $scope.tituloPantalla = 'Orden de Servicio';
                tipoOrden = Constants.ORDEN_SERVICIO;
                esServicio = true;
            }

            $scope.proveedores = [];

            /* Cargar información de listas */
            function cargarProveedores() {
                proveedorFactory.getAll().then(function(proveedores) {
                    $scope.proveedores = proveedores;
                });
            }

            function getCentroCostos() {
                productoFactory.getCentroCostos().then(function(centroCostos) {
                    $scope.centroCostos = centroCostos;
                });
            }

            function selectCentroCostos(centroCosto) {
                $scope.orden.CentroCostos = centroCosto;
            }

            getCentroCostos();
            $scope.selectCentroCostos = selectCentroCostos;
            cargarProveedores();

            if (ordenId) {
                $scope.estadoFactura = Constants.ESTADO;
                ordenFactory.getById(ordenId).then(function(orden) {
                    $scope.orden = orden;
                    $scope.orden.showTextBox = true;
                    $scope.orden.Tipo = tipoOrden;
                    $scope.orden.IdOrdenBase = orden.Id;
                    $scope.orden.Id = 0;

                    //Get Fecha Entrega
                    $scope.getFechaEntrega();

                    for (var i = 0; i < orden.OrdenItems.length; i += 1) {
                        orden.OrdenItems[i].Id = 0;
                    }

                });
            } else {
                $scope.estadoFactura = Constants.EN_ELABORACION;
                $scope.orden = ordenFactory.getOrdenObject();
                $scope.orden.showTextBox = false;
                $scope.orden.AddItem();
                $scope.orden.Tipo = tipoOrden;
                $scope.orden.Solicitante = accountFactory.getAuthenticationData().userName;
            }

            function saveProveedor(proveedorObj, model, label) {
                $scope.orden.IdProveedor = proveedorObj.Id;
                $scope.orden.Proveedor = proveedorObj;
                $scope.orden.Plazo = $scope.orden.Proveedor.Plazo;
                $scope.getFechaEntrega();
            }

            function saveProducto(productoObj, model, label, ordenItemObj) {
                ordenItemObj.Producto = productoObj;
            }

            $scope.saveProveedor = saveProveedor;
            $scope.saveProducto = saveProducto;

            $scope.getFechaEntrega = function() {
                var fecha = moment($scope.orden.FechaOrden, Constants.formatDate).format(Constants.formatDate2);
                var plazo = $scope.orden.Plazo;
                return ordenFactory.getFechaEntrega(plazo, fecha).then(function(data) {
                    if (data.length > 0) {
                        $scope.orden.FechaEntrega = moment(data[0].Fecha).format(Constants.formatDate);
                    } else {
                        toaster.pop('warning', 'NO HAY FECHA DE ENTREGA', 'No existe calendario para la fecha descrita');
                    }
                });
            };

            $scope.hasChangedPlazoField = function() {
                $scope.orden.Plazo = Math.abs($scope.orden.Plazo);
                if ($scope.orden.Plazo && $scope.orden.Plazo > 0) {
                    $scope.getFechaEntrega();
                }
            };

            $scope.getProductos = function(search) {
                return productoFactory.queryProdAndSer(search, esServicio).then(function(data) {
                    return data;
                });
            };

            $scope.addProducto = function() {
                $scope.orden.AddItem();
            };

            $scope.removeProduct = function(index) {
                $scope.ordenForm.$setPristine();
                $scope.orden.removeItem(index);
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

            $scope.save = function(isValid) {
                var saveAndCloseClick = $scope.saveAndCloseClick;
                if (isValid) {
                    if ($scope.orden.OrdenItems.length === 0) {
                        toaster.pop('error', 'Operación Fallida', 'Debe ingresar por lo menos un producto/servicio.');
                    } else {
                        ordenFactory.save($scope.orden).then(function(response) {
                            toaster.pop('success', 'Operación Exitosa', 'La ' + tipoOrden + ' fue creada exitosamente con Número: ' + response);
                            $scope.clearForm();
                        }, function error(response) {
                            // An error has occurred
                            $rootScope.$emit('evento', {
                                descripcion: response.statusText
                            });
                        });
                    }

                }
            };
        }
    ]);
