'use strict';

/**
 * @ngdoc service
 * @name almacenApp.apiFactory
 * @description
 * # apiFactory
 * Factory in the almacenApp.
 */
angular
  .module('almacenApp')
  .factory('apiFactory', ['appConfig', 'Restangular',
    function(appConfig, Restangular) {
        return Restangular.withConfig(function (Restangular) {
            Restangular.setBaseUrl(appConfig.apiDomain + appConfig.apiPath);
            Restangular.setDefaultHttpFields({
                timeout: appConfig.apiTimeout,
                responseType : 'json',
                "Access-Control-Allow-Headers" : "Content-Type, x-xsrf-token"
            });
        });
    }]);

