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
    .factory('accountFactory', ['Restangular', 'apiFactory', 'WS','appConfig', '$http',
        function(Restangular, apiFactory, WS, appConfig, $http) {
            return {
                generateAccessToken: function(loginData) {
                    var requestToken = $http({
                        method: 'POST',
                        url: appConfig.apiDomain + WS.URI_TOKEN,
                        data: $.param(loginData),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    });

                    return requestToken;
                }
            };
        }
    ]);