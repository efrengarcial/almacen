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
    .factory('userFactory', ['apiFactory', 'WS',
        function(apiFactory, WS) {

            return {

                getUsers: function() {
                    return apiFactory.all(WS.URI_USERS).getList().then(function(users) {
                        return users;
                    });
                }
            };
        }
    ]);