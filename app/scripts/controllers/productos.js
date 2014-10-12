'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
  .controller('ProductosCtrl', function ($scope,$log) {
  	$log.debug('ddd');
    $scope.nombre="";

    $scope.submit = function(isValid) {
    	$log.debug(isValid);
    	alert(isValid);
    	if (isValid) {
    		alert('Ok');	
    	}
       	
      };

    $scope.buscar = function() {
       	$log.debug('xxxxxxxx......');
      };

  }).directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {

           if (inputValue === undefined){
            return '';                           
           } 

           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput !== inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
});
