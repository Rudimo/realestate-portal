var app = angular.module('Realza.directives', []);

app.directive('integer', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var INTEGER_REGEXP = /^\s*(\+|-)?\d+\s*$/;
                if (INTEGER_REGEXP.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('invalid', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('invalid', false);
                    return undefined;
                }
            });
        }
    };
});

app.directive('float', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var FLOAT_REGEXP = /^[0-9]*[.][0-9]+$/;
                if (FLOAT_REGEXP.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('invalid', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('invalid', false);
                    return undefined;
                }
            });
        }
    };
});

app.directive('number', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var NUMBER_REGEXP = /^[+-]?\d+(\.\d+)?$/;
                if (NUMBER_REGEXP.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('invalid', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('invalid', false);
                    return undefined;
                }
            });
        }
    };
});

app.directive('ngConfirmClick', [
    function () {
        return {
            link: function (scope, element, attr) {
                var msg         = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function (event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction);
                    }
                });
            }
        };
    }]);

app.directive("comaDotConverter", function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {

            modelCtrl.$parsers.push(function (inputValue) {

                var NUMBER_REGEXP = /^[+-]?\d+(\.\d+)?$/;

                if (NUMBER_REGEXP.test(inputValue)) {
                    modelCtrl.$setValidity('invalid', true);
                } else {
                    modelCtrl.$setValidity('invalid', false);
                }

                if (typeof (inputValue) === "undefined") {
                    return '';
                }

                var transformedInput = inputValue.replace(/,/g, '.');

                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});

app.directive('convertToNumber', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function (val) {
                return val ? parseInt(val, 10) : undefined;
            });
            ngModel.$formatters.push(function (val) {
                if (val) {
                    return '' + val;
                }
            });
        }
    };
});

app.directive('hasErrors', function () {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {
            // find the text box element, which has the 'name' attribute
            var inputEl = el[0].querySelector("[name]");
            // convert the native text box element to an angular element
            var inputNgEl = angular.element(inputEl);
            // get the name on the text box so we know the property to check
            // on the form controller
            var inputName = inputNgEl.attr('name');

            inputNgEl.bind('focus', function () {
                console.log('focus');
                el.toggleClass('has-error', false);
            });

            // only apply the has-error class after the user leaves the text box
            inputNgEl.bind('blur', function () {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });
        }
    }
});