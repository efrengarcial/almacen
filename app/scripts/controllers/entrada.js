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
        '$location', 'Constants','$routeParams',
        function($scope, $log, $rootScope, ordenFactory, toaster, $location, Constants,$routeParams) {
            $log.debug('Iniciando Entrada....');

            var idOrden = $routeParams.idOrden;
            ordenFactory.getById(idOrden).then(function(orden) {
                $scope.orden = orden;
            });
        }
    ]);