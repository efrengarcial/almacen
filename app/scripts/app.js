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
    'angularMoment'
  ])
  .config(function ($routeProvider,$logProvider,$locationProvider) {
    $logProvider.debugEnabled(true);
    //$locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/productos', {
        templateUrl: 'views/productos.html',
        controller: 'ProductosCtrl'
      })
      .when('/ordenCompra', {
        templateUrl: 'views/orden.html',
        controller: 'OrdenCtrl'
      })
      .when('/requisicion', {
        templateUrl: 'views/orden.html',
        controller: 'OrdenCtrl'
      })
      .when('/ordenServicio', {
        templateUrl: 'views/orden.html',
        controller: 'OrdenCtrl'
      })
      .when('/consultarOrden', {
        templateUrl: 'views/consultarOrden.html',
        controller: 'ConsultarOrdenCtrl'
      })
       .when('/ordenItem', {
        templateUrl: 'views/ordenItem.html',
        controller: 'OrdenCtrl'
      })
      .when('/proveedor', {
        templateUrl: 'views/proveedor.html',
        controller: 'ProveedorCtrl'
      })
      .when('/inboxOrden', {
        templateUrl: 'views/inboxOrden.html',
        controller: 'inboxOrdenCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AccountCtrl'
      })                    
      .otherwise({
        redirectTo: '/'
      });
  })
   .run(['Restangular','$rootScope','toaster',  
    function(Restangular, $rootScope,toaster) {

      $rootScope.$on('evento', function(event, message) {
          toaster.pop('error', 'Error', message.descripcion);
      });

      Restangular.setErrorInterceptor(
        function(response) { 
          if(response.status === 0 ) {
            console.log('Error por timeout');
            $rootScope.$emit('evento', {descripcion: 'TIMEOUT | ERR_CONNECTION_REFUSED '});  
            return false; // error handled      
          } else if( response.status === 500) { 
            console.log('Error en el servidor');
            $rootScope.$emit('evento', {descripcion: response.statusText});
            return false; // error handled
          } else if(response.status === 404) {
            console.log('Page not found');
            $rootScope.$emit('evento', {descripcion : 'Page not found'});
            return false; // error handled
          }
          return true; // error not handled 
        }
      );
    }
  ]);
