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

angular.module('almacenApp').directive('numbersOnly', [

    function() {
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
    }
]);

angular.module('almacenApp').directive('ngFocus', [

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

angular.module('almacenApp').directive('dateLowerThan', ["$filter",
    function($filter) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                var validateDateRange = function(inputValue) {
                    var fromDate = $filter('date')(inputValue, 'short');
                    var toDate = $filter('date')(attrs.dateLowerThan, 'short');
                    var isValid = isValidDateRange(fromDate, toDate);
                    ctrl.$setValidity('dateLowerThan', isValid);
                    return inputValue;
                };

                ctrl.$parsers.unshift(validateDateRange);
                ctrl.$formatters.push(validateDateRange);
                attrs.$observe('dateLowerThan', function() {
                    validateDateRange(ctrl.$viewValue);
                });
            }
        };
    }
]);


angular.module('almacenApp').directive('dateGreaterThan', ["$filter",
    function($filter) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                var validateDateRange = function(inputValue) {
                    var fromDate = $filter('date')(attrs.dateGreaterThan, 'short');
                    var toDate = $filter('date')(inputValue, 'short');
                    var isValid = isValidDateRange(fromDate, toDate);
                    ctrl.$setValidity('dateGreaterThan', isValid);
                    return inputValue;
                };

                ctrl.$parsers.unshift(validateDateRange);
                ctrl.$formatters.push(validateDateRange);
                attrs.$observe('dateGreaterThan', function() {
                    validateDateRange(ctrl.$viewValue);

                });
            }
        };
    }
]);

var isValidDate = function(dateStr) {
    if (dateStr == undefined)
        return false;
    var dateTime = Date.parse(dateStr);

    if (isNaN(dateTime)) {
        return false;
    }
    return true;
};

var getDateDifference = function(fromDate, toDate) {
    return Date.parse(toDate) - Date.parse(fromDate);
};

var isValidDateRange = function(fromDate, toDate) {
    if (fromDate == "" || toDate == "")
        return true;
    if (isValidDate(fromDate) == false) {
        return false;
    }
    if (isValidDate(toDate) == true) {
        var days = getDateDifference(fromDate, toDate);
        if (days < 0) {
            return false;
        }
    }
    return true;
};