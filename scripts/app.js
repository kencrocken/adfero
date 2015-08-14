var timeTracker = angular.module('timeTracker', ['ngResource', 'ui.bootstrap', 'LocalStorageModule', 'chart.js'])
    .config(['localStorageServiceProvider', function(localStorageServiceProvider){
        localStorageServiceProvider
            .setPrefix('ls')
            .setNotify(true, true);
    }]);