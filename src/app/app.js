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

        staticDataFactory.currentVersionPromise().then(function (response) {
            $scope.currentVersion = angular.fromJson(response.data)[0];
            $scope.profileIconUrl = staticDataFactory.ddragonUrlPrefix() + $scope.currentVersion + staticDataFactory.profileIconPath();
        });

    });

