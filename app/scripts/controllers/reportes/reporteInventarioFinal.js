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
        'modalWindowFactory', 'moment', 'Constants', 'accountFactory', '$location', '$routeParams', '$sce', 'usSpinnerService',
        function($scope, $log, $rootScope, reportesFactory, toaster, $filter, modalWindowFactory, moment,
            Constants, accountFactory, $location, $routeParams, $sce, usSpinnerService) {
            $log.debug('Iniciando reporteInventario');

            $scope.reporte = {
                StartDate: new Date().getTime(),
                EndDate: new Date().getTime(),
            };

            $scope.startSpin = function() {
                usSpinnerService.spin('spinner-1');
            }
            $scope.stopSpin = function() {
                usSpinnerService.stop('spinner-1');
            }

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
                $scope.reporte = reporte = {
                    StartDate: new Date().getTime(),
                    EndDate: new Date().getTime(),
                };

                // Resets the form validation state.
                $scope.reporteInventarioFinalForm.$setPristine();
            };

            $scope.interacted = function(field) {
                return $scope.submitted || field.$dirty;
            };

            $scope.buscar = function() {
                var reporteInventarioFinal = reportesFactory.getReporteInventarioFinalObject();
                $scope.startSpin();
                reportesFactory.getReporteInventarioFinal(reporteInventarioFinal).then(function(blob) {
                    //var file = new Blob([bytes], {type: 'application/pdf'});
                    var fileURL = (window.URL || window.webkitURL).createObjectURL(blob);
                    $log.debug("fileURL is " + fileURL);
                    $scope.content = $sce.trustAsResourceUrl(fileURL);
                    $scope.showPdf = true;
                    $scope.stopSpin();
                });

                $log.debug("Buscar.......");
            };
        }
    ]);