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
        'jwtHelper', '$log','$rootScope',
        function(Restangular, apiFactory, WS, appConfig, $http, authorDataKey, jwtHelper, $log,$rootScope) {

            var _authenticationData = {
                isAuth: false,
                userName: "",
                permissions: [],
                roles : []
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
                    _authenticationData.permissions  = [];
                   $rootScope.authenticationData= _authenticationData;
                },
                getAuthenticationData: function() {
                    return _authenticationData;
                },
                setAuthenticationData: function(tokenAuth, userNameAuth) {
                    var data = {
                        token: tokenAuth,
                        userName: userNameAuth
                    };
                    sessionStorage.setItem(authorDataKey, JSON.stringify(data));
                    _authenticationData.isAuth = true;
                    _authenticationData.userName = userNameAuth;
                    //https://github.com/auth0/angular-jwt
                    var tokenPayload = jwtHelper.decodeToken(tokenAuth);
                    tokenPayload.permissions = JSON.parse(tokenPayload.permissions);
                    _authenticationData.permissions = tokenPayload.permissions;
                    $log.debug(tokenPayload);
                    $rootScope.authenticationData = _authenticationData;
                },
                fillAuthData: function() {

                    var authData = $.parseJSON(sessionStorage.getItem(authorDataKey));
                    if (authData) {
                        _authenticationData.isAuth = true;
                        _authenticationData.userName = authData.userName;
                        var tokenPayload = jwtHelper.decodeToken(authData.token);
                        tokenPayload.permissions = JSON.parse(tokenPayload.permissions);
                        _authenticationData.permissions = tokenPayload.permissions;
                        $log.debug(tokenPayload);
                        $rootScope.authenticationData = _authenticationData;
                    }
                },
                getUsers: function() {
                    return apiFactory.all(WS.URI_USERS).getList().then(function(users) {
                        return users;
                    });
                }
            };
        }
    ]);