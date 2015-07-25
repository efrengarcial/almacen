'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:SalidasCtrl
 * @description
 * # SalidasCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('SalidaCtrl', ['$scope', '$log', '$rootScope', 'salidaFactory', 'proveedorFactory', 'productoFactory', 'ordenFactory', 'toaster',
        '$location', 'Constants', 'accountFactory', '$routeParams', 'moment',
        function($scope, $log, $rootScope, salidaFactory, proveedorFactory, productoFactory, ordenFactory, toaster, $location, Constants, accountFactory, $routeParams, moment) {
            $log.debug('Iniciando Salida....');
            var esServicio = false;

            $scope.salida = salidaFactory.getSalidaObject();
            $scope.salida.AddItem();
            $scope.salida.esSolicitador = false;

            /* Cargar información de listas */
            $scope.users = [];

            function getUsers() {
                accountFactory.getUsers().then(function(users) {
                    $scope.users = users;
                });
            }

            function getCentroCostos() {
                salidaFactory.getCentroCostos().then(function(centroCostos) {
                    $scope.centroCostos = centroCostos;
                });
            }

            function selectCentroCostos(IdCentroCostos) {
                $scope.salida.SalidaItems.IdCentroCostos = '';
            }

            getUsers();
            getCentroCostos();
            $scope.selectCentroCostos = selectCentroCostos;

            function saveUsers(usersObj, model, label) {
                if ($scope.salida.esSolicitador === true) {
                    $scope.salida.IdSolicitador = usersObj.Id;

                } else {
                    $scope.salida.IdRecibidor = usersObj.Id;
                };
                $scope.salida.User = usersObj;
            }

            function saveProducto(productoObj, model, label, salidaItemObj) {
                salidaItemObj.Producto = productoObj;
                //salidaItemObj.SalidaItems = productoObj;

            }

            $scope.saveUsers = saveUsers;
            $scope.saveProducto = saveProducto;

            $scope.getProductos = function(search) {
                return productoFactory.queryProdAndSer(search, esServicio).then(function(productos) {
                    return productos;
                });
            };

            $scope.addItem = function() {
                $scope.salida.AddItem();

            };

            $scope.noRepeatProduct = function() {
                var salidaItems = $scope.salida.SalidaItems,
                    items = [];

                for (var i = 0; i < salidaItems.length; i++) {

                    if ((salidaItems[i].Producto !== null) && (containsElement(items, salidaItems[i].Producto.Id) === true)) {
                        salidaItems[i].Producto = null;
                    }

                    if ((salidaItems[i].Producto !== null) && (containsElement(items, salidaItems[i].Producto.Id) === false)) {
                        items.push(salidaItems[i].Producto.Id);
                    }

                }
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
                $scope.salida.Solicitante = accountFactory.getAuthenticationData().userName; //Revisar
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
                    settingProducts();
                    if ($scope.salida.SalidaItems.length === 0) {
                        toaster.pop('error', 'Operación Fallida', 'Debe ingresar por lo menos un producto.');
                    } else {
                        //Revisar esta funcion: Actualiza cantidad inventario 
                        $scope.updateProducts($scope.productos);
                        salidaFactory.save($scope.salida).then(function() {
                            toaster.pop('success', 'Operación Exitosa', 'La orden de Salida fue creada exitosamente.');
                            $scope.clearForm();
                        }, function error(response) {
                            $rootScope.$emit('evento', {
                                descripcion: response.statusText
                            });
                        });
                    }
                }
            };


            $scope.updateProducts = function(productos) {
                var producto = {};

                for (var i = 0; i < productos.length; i++) {

                    productos[i].Cantidad = parseInt($scope.salida.SalidaItems[i].Cantidad);
                    producto = productos[i];
                    productoFactory.save(producto);
                }

                productoFactory.save(producto).then(function() {
                    if (producto.Id === 0) {
                        toaster.pop('success', 'mensaje', 'El producto fue creado exitosamente.');
                    } else {
                        toaster.pop('success', 'mensaje', 'El producto fue actualizado exitosamente.');
                    }
                }, function error(response) {
                    // An error has occurred
                    $rootScope.$emit('evento', {
                        descripcion: response.statusText
                    });
                });
            };


            $scope.getOrdenByNum = function(ordenNum, index, IdProduct) {

                if (ordenNum !== null && ordenNum !== "") {
                    ordenFactory.getOrdenByNum(ordenNum).then(function(orden) {
                        if (orden.length > 0) {
                            //pendiente por revisar $log.debug(JSON.stringify(orden));
                            if (getProductId(orden, IdProduct) === true) {
                                $log.debug('true ' + orden[0].Id);
                                $scope.salida.SalidaItems[index].NumeroOrden = ordenNum;
                                $scope.salida.SalidaItems[index].IdOrden = orden[0].Id;
                            } else {
                                $scope.salida.SalidaItems[index].NumeroOrden = null;
                            }
                        } else {
                            $scope.salida.SalidaItems[index].NumeroOrden = null;
                        }
                    });
                } else {
                    $scope.salida.SalidaItems[index].NumeroOrden = null;
                }
            };

            function getProductId(orden, IdProduct) {
                for (var i = 0; i < orden.length; i++) {
                    for (var j = 0; j < orden[i].OrdenItems.length; j++) {
                        if (orden[i].OrdenItems[j].IdProducto === IdProduct) {
                            return true;
                        };
                    }
                }
                return false;
            }

            function containsElement(arr, obj) {
                var i = arr.length;
                while (i--) {
                    if (arr[i] === obj) {
                        return true;
                    }
                }
                return false;
            }

            function settingProducts() {
                $scope.productos = [];
                var salidaItems = $scope.salida.SalidaItems;
                for (var i = 0; i < salidaItems.length; i++) {
                    $scope.productos.push(salidaItems[i].Producto);
                };
            }

        }
    ]);
