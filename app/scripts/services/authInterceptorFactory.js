'use strict';
angular
    .module('almacenApp')
    .factory('authInterceptorFactory', ['$q', '$injector', '$location','$log',
        function($q, $injector, $location, $log) {

            var authInterceptorServiceFactory = {};

            var _request = function(config) {

                config.headers = config.headers || {};

                var authData = $.parseJSON(sessionStorage.getItem('authorizationData'));
                if (authData) {
                    //$log.debug(authData.token);
                    config.headers.Authorization = 'Bearer ' + authData.token;
                }

                return config;
            }

            var _responseError = function(rejection) {
                if (rejection.status === 401) {
                    var accountFactory = $injector.get('accountFactory');
                    var authData = $.parseJSON(sessionStorage.getItem('authorizationData'));

                    if (authData) {
                        if (authData.useRefreshTokens) {
                            $location.path('/refresh');
                            return $q.reject(rejection);
                        }
                    }
                    accountFactory.logout();
                    $location.path('/login');
                }
                return $q.reject(rejection);
            }

            authInterceptorServiceFactory.request = _request;
            authInterceptorServiceFactory.responseError = _responseError;

            return authInterceptorServiceFactory;
        }
    ]);