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
                save: function(proveedor) {
                    return apiFactory.all(WS.URI_SAVE_PROVEEDOR).post(proveedor);
                },
                inactivate: function(idProveedor) {
                    return apiFactory.all(WS.URI_INACTIVATE_PROVEEDOR).post(idProveedor);
                },                
                query: function(search) {
                    return apiFactory.all(WS.URI_QUERY_PROVEEDOR).one(search).
                    getList().then(function(proveedores) {
                        return proveedores;
                    });
                },
                getAll: function() {
                    return apiFactory.all(WS.URI_PROVEEDORES).getList().then(function(proveedores) {
                        return proveedores;
                    });
                }
            };
        }
    ]);