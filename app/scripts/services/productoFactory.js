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
        getLineas : function() {
          return apiFactory.all(WS.URI_LINEAS).getList().then(function(lineas) {           
            return lineas;
          });
        },
        getMedidas : function() {
          return apiFactory.all(WS.URI_MEDIDAS).getList().then(function(medidas) {           
            return medidas;
          });
        }
      };
    }]);