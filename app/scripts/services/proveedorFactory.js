'use strict';

/**
 * @ngdoc service
 * @name almacenApp.listasFactory
 * @description
 * # listasFactory
 * Factory in the almacenApp.
 */

angular.module('almacenApp').factory('proveedorFactory', ['Restangular', 'apiFactory', 'WS',
        function(Restangular, apiFactory, WS) {
            return {
                saveProveedor: function(proveedor) {
                    return apiFactory.all(WS.URI_SAVE_PROVEEDOR).post(proveedor);
                },
                query: function(search) {
                    return apiFactory.all(WS.URI_QUERY_PROVEEDOR).one(search).
                    getList().then(function(proveedores) {
                        return proveedores;
                    });
                },
            };
        }
    ]);