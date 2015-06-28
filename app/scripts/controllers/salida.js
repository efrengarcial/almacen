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
                $log.debug('IdCentroCostos: ' + IdCentroCostos)
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
                    if ($scope.salida.SalidaItems.length === 0) {
                        toaster.pop('error', 'Operación Fallida', 'Debe ingresar por lo menos un producto.');
                    } else {
                        salidaFactory.save($scope.salida).then(function() {
                            toaster.pop('success', 'Operación Exitosa', 'La orden de Salida fue creada exitosamente.');
                            $log.debug('save: ' + $scope.salida);
                            $scope.clearForm();
                        }, function error(response) {
                            $rootScope.$emit('evento', {
                                descripcion: response.statusText
                            });
                        });
                    }
                }
            };
        }
    ]);
