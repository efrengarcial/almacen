'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:ConsultarOrdenCtrl
 * @description
 * # ConsultarOrdenCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ConsultarOrdenCtrl', ['$scope', '$log', '$rootScope', 'proveedorFactory', 'toaster', '$filter',
        'modalWindowFactory', 'Constants',
        function($scope, $log, $rootScope, proveedorFactory, toaster, $filter, modalWindowFactory, Constants) {
            $log.debug('Iniciando consultar orden');


            //Interacted and show message about required
            $scope.interacted = function(field) {
                return $scope.submitted || field.$dirty;
            };

            $scope.showMessage = function() {
                $('.required-icon, .required-combo-icon').tooltip({
                    placement: 'left',
                    title: 'Campo requerido'
                });
            };

        }
    ]);