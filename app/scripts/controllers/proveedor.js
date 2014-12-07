'use strict';

/**
 * @ngdoc function
 * @name almacenApp.controller:OrdenCompraCtrl
 * @description
 * # OrdenCompraCtrl
 * Controller of the almacenApp
 */
angular.module('almacenApp')
    .controller('ProveedorCtrl', function($scope, $log) {
        $log.debug('Iniciando orden proveedores...');


        $scope.submit = function(isValid) {
            $log.debug(isValid);
            if (isValid) {
                alert('Ok');
            }

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

    }).directive('numbersOnly', function() {
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