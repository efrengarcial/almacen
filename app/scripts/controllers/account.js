'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the almacenApp
 */

angular.module('almacenApp')
    .controller('AccountCtrl', ['$scope', '$log', '$rootScope', 'toaster', 'accountFactory',
        'authorDataKey', '$location',
        function($scope, $log, $rootScope, toaster, accountFactory, authorDataKey, $location) {
            $log.debug('Iniciando Account...');

            $scope.hasLoginError = false;
            $scope.credentials = {};

            // Callbacks
            var errorLoginCallback = function(data, status, headers, config) {
                $log.debug(data);
                $scope.hasLoginError = true;
                $scope.loginErrorDescription = data.error_description;
                //$rootScope.isAuthenticated = false;
            }

            var successLoginCallback = function(result) {
                $log.debug(result);
                $location.path("/about");
                accountFactory.setAuthenticationData( result.access_token, $scope.credentials.login);
                $scope.hasLoginError = false;
                //$rootScope.isAuthenticated = true;
            }

            // Generate Token - Login
            $scope.login = function() {
                $scope.result = '';

                var loginData = {
                    grant_type: 'password',
                    username: $scope.credentials.login,
                    password: $scope.credentials.password
                };

                accountFactory.generateAccessToken(loginData)
                    .success(successLoginCallback)
                    .error(errorLoginCallback);

            }

            $scope.isUserAuthenticated = function() {
                return accountFactory.isUserAuthenticated();
            }

            $scope.logout = function() {
                accountFactory.logout();
            }

        }
    ]);