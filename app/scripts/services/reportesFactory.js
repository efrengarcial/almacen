'use strict';

/**
 * @ngdoc service
 * @name almacenApp.reportesFactory
 * @description
 * # reportesFactory
 * Factory in the almacenApp.
 */

angular.module('almacenApp').factory('reportesFactory', ['Restangular', 'apiFactory', 'WS', '$log',
    function(Restangular, apiFactory, WS, $log) {
        return {
            save: function(proveedor) {
                $log.debug('Hail ' + proveedor + '!');
            },
            getReporteInventarioFinalObject: function() {
                var reporteInventarioFinal = {
                    StartDate: new Date().getTime(),
                    EndDate: new Date().getTime(),
                };

                return reporteInventarioFinal;
            }
        };
    }
]);
