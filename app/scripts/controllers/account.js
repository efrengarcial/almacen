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

        function($scope, $log, $rootScope, toaster, accountFactory) {
            $log.debug('Iniciando Account...');

            $scope.hasLoginError = false;

            // Callbacks
            var errorLoginCallback = function(data, status, headers, config) {
                $log.debug(data);
                $scope.hasLoginError = true;
                $scope.loginErrorDescription = data.error_description;
            }

            var successLoginCallback = function(result) {
                $log.debug(result);
                //$location.path("/submitorder");
                sessionStorage.setItem(tokenKey, result.access_token);
                $scope.hasLoginError = false;
                $scope.isAuthenticated = true;
            }

            // Generate Token - Login
            $scope.login = function() {
                $scope.result = '';

                var loginData = {
                    grant_type: 'password',
                    username: $scope.loginEmail,
                    password: $scope.loginPassword
                };
                $log.debug("username: " + $scope.loginEmail + " password: " + $scope.loginPassword);

                accountFactory.generateAccessToken(loginData)
                    .success(successLoginCallback)
                    .error(errorLoginCallback);

            }


        }
    ]);