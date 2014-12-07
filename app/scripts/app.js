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
    'ui.bootstrap'
  ])
  .config(function ($routeProvider,$logProvider) {
    $logProvider.debugEnabled(true);

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
        templateUrl: 'views/ordenCompra.html',
        controller: 'OrdenCompraCtrl'
      })
      .when('/proveedor', {
        templateUrl: 'views/proveedor.html',
        controller: 'ProveedorCtrl'
      })              
      .otherwise({
        redirectTo: '/'
      });
  })
   .run(['Restangular','$rootScope',  
    function(Restangular, $rootScope) {
      Restangular.setErrorInterceptor(
        function(response, deferred, responseHandler) { 
          if(response.status === 0 ) {
            console.log('Error por timeout');
            $rootScope.$emit('evento', {descripcion: 'PAGE.MSG.TIMEOUT'});  
            return false; // error handled      
          } else if( response.status === 500) { 
            console.log('Error en el servidor');
            $rootScope.$emit('evento', {descripcion: response.statusText});
            return false; // error handled
          } else if(response.status === 404) {
            console.log('Page not found');
            $rootScope.$emit('evento', {descripcion : 'PAGE.MSG.PAGENOTFOUND'});
            return false; // error handled
          }
          return true; // error not handled 
        }
      );
    }
  ]);
