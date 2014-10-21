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
      .otherwise({
        redirectTo: '/'
      });
  });
