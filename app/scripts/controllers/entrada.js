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
        '$location', 'Constants',
        function($scope, $log, $rootScope, ordenFactory, toaster, $location, Constants) {
            $log.debug('Iniciando Entrada....');

            ordenFactory.getOrdenById(1).then(function(orden) {
                $scope.orden = orden;
            });
        }
    ]);