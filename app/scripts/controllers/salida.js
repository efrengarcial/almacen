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
            $scope.users = [];

            function getUsers() {
                accountFactory.getUsers().then(function(users) {
                    $scope.users = users;
                });
            }

            getUsers();

            function saveUsers(usersObj, model, label) {
                $log.debug('label ' + label);
                $log.debug('model ' + JSON.stringify(usersObj));
                $scope.salida.IdUser = usersObj.Id;
                $scope.salida.User = usersObj;
            }


            function saveProducto(productoObj, model, label, salidaItemObj) {
                $log.debug('productoObj: \n' + JSON.stringify(productoObj));
                $log.debug('salidaItemObj: \n' + JSON.stringify(salidaItemObj));
                //salidaItemObj.Producto = productoObj;
                salidaItemObj.SalidaItems = productoObj;
                $log.debug('Orden: \n' + JSON.stringify(salidaItemObj.SalidaItems));

            }

            $scope.saveUsers = saveUsers;
            $scope.saveProducto = saveProducto;

            $scope.getProductos = function(search) {
                $log.debug('Buscando productos......');
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

            $scope.save = function() {
                $log.debug('save');
            };

        }
    ]);
