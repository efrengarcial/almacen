'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:inboxOrdenCtrl
 * @description
 * # inboxOrdenCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('inboxOrdenCtrl', ['$scope', '$log', '$rootScope', 'proveedorFactory', 'ordenFactory', 'toaster', '$filter', 'modalWindowFactory', 'moment', 'Constants',
        function($scope, $log, $rootScope, proveedorFactory, ordenFactory, toaster, $filter, modalWindowFactory, moment, Constants) {
            $log.debug('Iniciando Mis pendientes: ');

        }
    ]);