'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('ProductosCtrl',['$scope','$log','$rootScope','productoFactory','toaster','$filter', 
    function($scope, $log,$rootScope,productoFactory,toaster,$filter) {
        $log.debug('Iniciando Productos...');

        cargarLineas();
        cargarMedidas();

        $scope.clearForm = function () {
	        $scope.producto = null;
	       	// Resets the form validation state.
	        $scope.productoForm.$setPristine();
	        // Broadcast the event to also clear the grid selection.
	        $rootScope.$broadcast('clear');
	    };

        $scope.submit = function(isValid) {
            $log.debug(isValid);
            if (isValid) {
                alert('Ok');
            }

        };

        $scope.buscar = function() {
            $log.debug('Buscando......');
        };

        $scope.interacted = function(field) {
            return $scope.submitted || field.$dirty;
        };

        $scope.showMessage = function() {
            $('.required-icon, .required-combo-icon').tooltip({
                placement: 'left',
                title: 'Campo requerido'
            });
        };

        $scope.seleccionarLinea= seleccionarLinea;

        /*$scope.producto.Precio = {
            numberMaxDecimals: 9.99
        };

        $scope.producto.Iva = {
            numberMaxDecimals: 9.99
        };*/

        $rootScope.$on('evento', function(event, message) { 
			toaster.pop('error','Error',message)
		});

     	/* Cargar información de listas */
		function cargarLineas() { 
			productoFactory.getLineas().then(function(lineas) { 	
				$scope.lineas = lineas;				
			});
		}
		function cargarMedidas() { 
			productoFactory.getMedidas().then(function(medidas) { 	
				$scope.medidas = medidas;				
			});
		}
		function seleccionarLinea() { 
			var found = $filter('filter')($scope.lineas, {Id: $scope.producto.Linea}, true);
	        if (found.length) {
	        	$scope.producto.IdSubLinea="";
	            $scope.grupos = found[0].SubLineas;
	        } else {
	            $scope.grupos = [];
	         }

		}

    }]).directive('numbersOnly', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function(inputValue) {

                    if (inputValue === undefined) {
                        return '';
                    }

                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return inputValue;
                });
            }
        };
    });