'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:EntradaCtrl
 * @description
 * # EntradaCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('EntradaCtrl', ['$scope', '$log', '$rootScope', 'ordenFactory', 'toaster',
        '$location', 'Constants', '$routeParams',
        function($scope, $log, $rootScope, ordenFactory, toaster, $location, Constants, $routeParams) {
            $log.debug('Iniciando Entrada....' + $location.$$url);

            var idOrden = $routeParams.idOrden;
            ordenFactory.getById(idOrden).then(function(orden) {
                $scope.orden = orden;
            });

            $scope.interacted = function(field) {
                return $scope.submitted || field.$dirty;
            };

            $scope.showMessage = function() {
                $('.required-icon, .required-combo-icon').tooltip({
                    placement: 'left',
                    title: 'Campo requerido'
                });
            };

            $scope.save = function(isValid) {
                if (isValid) {
                    
                }
            }
        }
    ]);