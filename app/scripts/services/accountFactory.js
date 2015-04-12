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
    .factory('accountFactory', ['Restangular', 'apiFactory', 'WS', 'appConfig', '$http', 'authorDataKey',
        function(Restangular, apiFactory, WS, appConfig, $http, authorDataKey) {

            var _authenticationData = {
                isAuth: false,
                userName: ""
            };

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
                },
                isUserAuthenticated: function() {
                    return _authenticationData.isAuth;
                },
                logout: function() {
                    sessionStorage.removeItem(authorDataKey);
                    _authenticationData.isAuth = false;
                    _authenticationData.userName = "";
                },
                 getAuthenticationData: function(){
                    return _authenticationData;
                 },
                setAuthenticationData: function(_token, _userName) {
                    var data = {
                        token: _token,
                        userName: _userName
                    };
                    sessionStorage.setItem(authorDataKey, JSON.stringify(data));
                    _authenticationData.isAuth = true;
                    _authenticationData.userName = _userName;
                }
            };
        }
    ]);