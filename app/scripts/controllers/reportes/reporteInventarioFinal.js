'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller.reportes:ReporteInventarioFinalCtrl
 * @description
 * # ReporteInventarioFinalCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('ReporteInventarioFinalCtrl', ['$scope', '$log', '$rootScope', 'reportesFactory', 'toaster', '$filter',
        'modalWindowFactory', 'moment', 'Constants', 'accountFactory', '$location', '$routeParams',
        function($scope, $log, $rootScope, reportesFactory, toaster, $filter, modalWindowFactory, moment, Constants, accountFactory, $location, $routeParams) {
            $log.debug('Iniciando reporteInventario');

            $scope.reporteInventarioFinal = reportesFactory.getReporteInventarioFinalObject();
            reportesFactory.save('Dariodeath!');
            $scope.toggleMin = function() {
                $scope.minDate = moment(Constants.minDate).format(Constants.formatDate);
            };
            $scope.toggleMin();
            $scope.dateOptions = {
                formatYear: 'yyyy',
                startingDay: 1
            };
            $scope.format = Constants.datepickerFormatDate;


            //Auxiliars functions
            $scope.open = function($event, fecha) {
                $event.preventDefault();
                $event.stopPropagation();
                if ('openedStartDate' === fecha) {
                    $scope.openedStartDate = true;
                } else {
                    $scope.openedEndDate = true;
                }
            };

            $scope.clearForm = function() {
                $log.debug("clearForm");
                $scope.reporteInventarioFinal = reportesFactory.getReporteInventarioFinalObject();

                // Resets the form validation state.
                $scope.reporteInventarioFinalForm.$setPristine();
            };

            $scope.interacted = function(field) {
                return $scope.submitted || field.$dirty;
            };                        
        }
    ]);
