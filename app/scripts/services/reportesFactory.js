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
            getReporteInventarioFinal: function(reporte) {
                return apiFactory.all(WS.URI_REPORTES).withHttpConfig({responseType: 'blob'}).post(reporte);
            },
            getReporteInventarioFinalObject: function() {
                var report = {
                    ResourcePath: 'InventarioFinal',
                    Parameters: [{
                        Name: 'StartDate',
                        Data: null
                    }, {
                        Name: 'EndDate',
                        Data: null
                    }],
                    ReportDataSourceName : '',
                    DataSources: []
                };

                return report;
            }
        };
    }
]);