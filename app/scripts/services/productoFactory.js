'use strict';

/**
 * @ngdoc service
 * @name almacenApp.listasFactory
 * @description
 * # listasFactory
 * Factory in the almacenApp.
 */
angular
    .module('almacenApp')
    .factory('productoFactory', ['Restangular', 'apiFactory', 'WS',
        function(Restangular, apiFactory, WS) {
            return {
                getLineas: function() {
                    return apiFactory.all(WS.URI_LINEAS).getList().then(function(lineas) {
                        return lineas;
                    });
                },
                getMedidas: function() {
                    return apiFactory.all(WS.URI_MEDIDAS).getList().then(function(medidas) {
                        return medidas;
                    });
                },
                save: function(producto) {
                    return apiFactory.all(WS.URI_SAVE_PRODUCTO).post(producto);
                },
                inactivate: function(idProducto) {
                    return apiFactory.all(WS.URI_INACTIVATE_PRODUCTO).post(idProducto);
                },
                query: function(search) {
                    return apiFactory.all(WS.URI_QUERY_PRODUCTO).one(search).getList();
                },
                queryProdAndSer: function(search,esServicio) {
                    return apiFactory.all(WS.URI_QUERY_PRODUCTO).one(search).one(esServicio).getList();
                },
                getCentroCostos: function() {
                    return apiFactory.all(WS.URI_CENTRO_COSTOS).getList().then(function(centroCostos) {
                        return centroCostos;
                    });
                }
            };
        }
    ]);