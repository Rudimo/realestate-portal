//'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('Realza', ['Realza.services', 'Realza.directives', 'ngAnimate',
    'angular-growl', 'flow', 'dndLists', 'ui.bootstrap', 'oi.file', 'ngCookies']);

app.config(['$locationProvider', 'growlProvider', '$interpolateProvider', '$compileProvider',
    function ($locationProvider, growlProvider, $interpolateProvider, $compileProvider) {

        $compileProvider.debugInfoEnabled(false);
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');

        growlProvider.globalTimeToLive(5000);
        growlProvider.globalDisableCountDown(true);
        growlProvider.onlyUniqueMessages(false);
    }]);

app.run(['$rootScope', function ($rootScope) {}]);