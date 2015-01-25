'use strict';
/*global $:false */
/**
 * @ngdoc directive
 * @name almacenApp.directive:directives
 * @description
 * # directives
 */
angular.module('almacenApp');

function isEmpty(value) {
    return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

angular.module('almacenApp').directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
                if (inputValue === undefined) {
                    return '';
                }
                console.log(inputValue);
                try {
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                } catch (err) {
                    console.log(err);
                }

                return inputValue;
            });
        }
    };
});

angular
    .module('almacenApp')
    .directive('ngFocus', [

        function() {
            var FOCUS_CLASS = 'ng-focused';
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ctrl) {
                    ctrl.$focused = false;
                    element.bind('focus', function(evt) {
                        element.addClass(FOCUS_CLASS);
                        scope.$apply(function() {
                            ctrl.$focused = true;
                        });
                    }).bind('blur', function(evt) {
                        element.removeClass(FOCUS_CLASS);
                        scope.$apply(function() {
                            ctrl.$focused = false;
                        });
                    });
                }
            };
        }
    ]);