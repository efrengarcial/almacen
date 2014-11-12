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
      .otherwise({
        redirectTo: '/'
      });
  })
   .run(['Restangular','$rootScope',  
    function(Restangular, $rootScope) {
      Restangular.setErrorInterceptor(
        function(response) { 
          if(response.status === 0 ) {
            console.log('Error por timeout');
            $rootScope.$emit('evento', {descripcion: 'PAGE.MSG.TIMEOUT'});        
          } else if( response.status === 500) { 
            console.log('Error en el servidor');
            $rootScope.$emit('evento', {descripcion: 'PAGE.MSG.SERVERERROR' + response.data.descripcion});
          } else if(response.status === 404) {
            console.log('Page not found');
            $rootScope.$emit('evento', {descripcion : 'PAGE.MSG.PAGENOTFOUND'});
          } 
        }
      );
    }
  ]);
