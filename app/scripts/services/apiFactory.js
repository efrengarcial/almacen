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
    .factory('apiFactory', ['appConfig', 'Restangular', 'accountFactory',
        function(appConfig, Restangular, accountFactory) {
            return Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(appConfig.apiDomain + appConfig.apiPath);
                RestangularConfigurer.setDefaultHttpFields({
                    timeout: appConfig.apiTimeout,
                    responseType: 'json'
                });
                var token = accountFactory.getAuthenticationData().token;
                if (!isEmpty(token)) {
                    RestangularConfigurer.setDefaultHeaders({
                        Authorization: 'Bearer ' + token
                    })
                }

            });
        }
    ]);