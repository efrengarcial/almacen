'use strict';

/**
 * @ngdoc overview
 * @name almacenApp
 * @description
 * # almacenApp
 *
 * Main module of the application.
 */
angular
    .module('almacenApp', [
        'restangular',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngMessages',
        'ngSanitize',
        'fcsa-number',
        'toaster',
        'ngGrid',
        'ui.bootstrap',
        'angularMoment',
        'angular-jwt'        
    ]).
config(function($routeProvider, $logProvider, $locationProvider, $httpProvider, RestangularProvider) {
    $logProvider.debugEnabled(true);
    //$locationProvider.html5Mode(true);
    //$httpProvider.interceptors.push('authInterceptorFactory');
    //$httpProvider.interceptors.push('httpErrorHandler');

    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/unauthorizedAccess', {
            templateUrl: 'views/unauthorizedAccess.html',
            controller: 'AboutCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'AccountCtrl'
        })
        .when('/productos', {
            templateUrl: 'views/productos.html',
            controller: 'ProductosCtrl',
            resolve: { //Here we would use all the hardwork we have done 
                //above and make call to the authorization Service 
                //resolve is a great feature in angular, which ensures that a route 
                //controller (in this case superUserController ) is invoked for a route 
                //only after the promises mentioned under it are resolved.
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.ADMIN_PRODUCTOS]);
                },
            }
        })
        .when('/ordenCompra', {
            templateUrl: 'views/orden.html',
            controller: 'OrdenCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.ORDEN_COMPRA]);
                },
            }

        })
        .when('/requisicion', {
            templateUrl: 'views/orden.html',
            controller: 'OrdenCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.REQUISICION]);
                },
            }
        })
        .when('/ordenServicio', {
            templateUrl: 'views/orden.html',
            controller: 'OrdenCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.ORDEN_SERVICIO]);
                },
            }
        })
        .when('/requisicionServicio', {
            templateUrl: 'views/orden.html',
            controller: 'OrdenCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.REQUISICION_SERVICIO]);
                },
            }
        })
        .when('/consultarOrden', {
            templateUrl: 'views/consultarOrden.html',
            controller: 'ConsultarOrdenCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.CONSULTAR_ORDENES]);
                },
            }
        })
        /*
        .when('/ordenItem', {
            templateUrl: 'views/ordenItem.html',
            controller: 'OrdenCtrl'
        }) */
        .when('/proveedor', {
            templateUrl: 'views/proveedor.html',
            controller: 'ProveedorCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.ADMIN_PRODUCTOS]);
                },
            }
        })
        .when('/inboxOrden', {
            templateUrl: 'views/inboxOrden.html',
            controller: 'InboxOrdenCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.REQUISICIONES_POR_PROCESAR]);
                },
            }
        })
        .when('/ordenDetails', {
            templateUrl: 'views/ordenDetails.html',
            controller: 'OrdenDetailsCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.CONSULTAR_ORDENES]);
                },
            }
        })
        .when('/entradas', {
            templateUrl: 'views/inboxOrden.html',
            controller: 'InboxOrdenCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.ENTRADAS]);
                },
            }
        })
        .when('/entrada', {
            templateUrl: 'views/entrada.html',
            controller: 'EntradaCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.ENTRADAS]);
                },
            }
        })
        .when('/salida', {
            templateUrl: 'views/salida.html',
            controller: 'SalidaCtrl',
            resolve: { 
                permission: function(authorizationFactory, $route, Permissions) {
                    return authorizationFactory.permissionCheck([Permissions.SALIDAS]);
                },
            }
        })
        .otherwise({
            redirectTo: '/'
        });
}).
run(['Restangular', '$rootScope', '$log', 'accountFactory', 'authorDataKey', 'toaster',
    function(Restangular, $rootScope, $log, accountFactory, authorDataKey, toaster) {

        accountFactory.fillAuthData();

        $rootScope.$on('evento', function(event, message) {
            toaster.pop('error', 'Error', message.descripcion);
        });


        Restangular.setErrorInterceptor(
            function(response, deferred, responseHandler) {
                if (response.status == 401) {
                    /*dialogs.error("Unauthorized - Error 401", "You must be authenticated in order to access this content.")
                        .result.then(function() {
                            // continue promise chain in this callback.
                            deferred.reject("unauthorized");
                            $location.path("/login");
                        }); * 

                    var authData = $.parseJSON(sessionStorage.getItem(authorDataKey));

                    /*if (authData) {
                        if (authData.useRefreshTokens) {
                            $location.path('/refresh');
                            return $q.reject(rejection);
                        }
                    }*/
                    accountFactory.logout();
                    $location.path('/login');

                    // Stop the promise chain here
                    // all unauthorized access are handled the same.
                    return false;
                }
                // Some other unknown Error.
                $log.debug(response);
                toaster.pop('error', '', response.statusText + " - Error " + response.status,
                    "An unknown error has occurred.<br>Details: " + response.data);

                /*dialogs.error(response.statusText + " - Error " + response.status,
                    "An unknown error has occurred.<br>Details: " + response.data);*/

                // DON'T stop promise chain since error is not handled
                return true;
            }


            /*function(response) {
                    if (response.status === 0) {
                        console.log('Error por timeout');
                        $rootScope.$emit('evento', {
                            descripcion: 'PAGE.MSG.TIMEOUT'
                        });
                    } else if (response.status === 500) {
                        console.log('Error en el servidor');
                        $rootScope.$emit('evento', {
                            descripcion: 'PAGE.MSG.SERVERERROR' + response.data.descripcion
                        });
                    } else if (response.status === 404) {
                        console.log('Page not found');
                        $rootScope.$emit('evento', {
                            descripcion: 'PAGE.MSG.PAGENOTFOUND'
                        });
                    }
                }*/
        );

    }
]);