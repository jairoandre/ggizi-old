//var apiPath = 'http://localhost:8080/api/';
var apiPath = 'api/';

angular.module('ggizi', [
    'templates-app',
    'templates-common',
    'ggizi.static',
    'ggizi.home',
    'ggizi.about',
    'ggizi.champion',
    'ggizi.summoner',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngAnimate'
])

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    })

    .run(function run() {
    })

    .controller('AppCtrl', function AppCtrl($scope, staticDataFactory) {
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | ggizi';
            }
        });

        $scope.currentVersion = null;

        staticDataFactory.currentVersion().then(function (response) {
            $scope.currentVersion = angular.fromJson(response.data);
            $scope.profileIconUrl = staticDataFactory.ddragonUrlPrefix() + $scope.currentVersion + staticDataFactory.profileIconPath();
        });

    });

