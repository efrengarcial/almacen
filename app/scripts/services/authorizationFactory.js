'use strict';

/**
 * @ngdoc service
 * @name almacenApp.listasFactory
 * @description
 * # listasFactory
 * Factory in the almacenApp.
 * http://www.codeproject.com/Tips/811782/AngularJS-Routing-Security
 */
angular
    .module('almacenApp')
    .factory('authorizationFactory', function($resource, $q, $rootScope, $location, accountFactory) {
        return {

            canAccess: function(permissionCollection) {
                var ifPermissionPassed = false;
                var permissions = accountFactory.getAuthenticationData().permissions;

                angular.forEach(permissionCollection, function(permission) {
                    if (permissions.indexOf(permission) !== -1) {
                        ifPermissionPassed = true;
                    }
                });

                return ifPermissionPassed;
            },

            permissionCheck: function(permissionCollection) {

                // we will return a promise .
                var deferred = $q.defer();

                //Checking if permission object(list of permissions for logged in user) 
                //is already filled from service
                this.getPermission(accountFactory.getAuthenticationData().permissions,
                    permissionCollection, deferred);

                return deferred.promise;
            },

            //Method to check if the current user has required role to access the route
            //'permissions' has permission information obtained from server for current user
            //'permissionCollection' is the list of permissions which are authorized to access route
            //'deferred' is the object through which we shall resolve promise
            getPermission: function(permissions, permissionCollection, deferred) {
                var ifPermissionPassed = false;

                angular.forEach(permissionCollection, function(permission) {
                    if (permissions.indexOf(permission) !== -1) {
                        ifPermissionPassed = true;
                    }
                });
                if (!ifPermissionPassed) {
                    //If user does not have required access, 
                    //we will route the user to unauthorized access page
                    $location.path("/unauthorizedAccess");
                    //As there could be some delay when location change event happens, 
                    //we will keep a watch on $locationChangeSuccess event
                    // and would resolve promise when this event occurs.
                    $rootScope.$on('$locationChangeSuccess', function(next, current) {
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }
            }
        };
    });