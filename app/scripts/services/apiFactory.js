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
    .factory('apiFactory', ['appConfig', 'Restangular', 'tokenKey','$log',
        function(appConfig, Restangular, tokenKey,$log) {
            return Restangular.withConfig(function(Restangular) {
                Restangular.setBaseUrl(appConfig.apiDomain + appConfig.apiPath);
                Restangular.setDefaultHttpFields({
                    timeout: appConfig.apiTimeout,
                    responseType: 'json'
                });

                var token = sessionStorage.getItem(tokenKey);
                $log.debug(token);

                var headers = {};
                if (token) {
                    headers.Authorization = 'Bearer ' + token;
                    Restangular.setDefaultHeaders( headers );
                }
               
            });
        }
    ]);