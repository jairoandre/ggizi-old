angular.module('ggizi', [
    'templates-app',
    'templates-common',
    'ggizi.static',
    'ggizi.home',
    'ggizi.about',
    'ggizi.champion',
    'ggizi.summoner',
    'ui.router',
    'ngAnimate',
    'cgBusy'
])

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    })

    .run(function run() {
    })

    .controller('AppCtrl', function AppCtrl($scope, sharedPromise, staticDataFactory) {
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = toState.data.pageTitle + ' | ggizi';
            }
        });

        $scope.delay = 0;
        $scope.minDuration = 0;
        $scope.message = 'Please Wait...';
        $scope.backdrop = true;
        $scope.templateUrl = 'assets/custom-template.html';
        $scope.currentVersion = null;

        staticDataFactory.currentVersionPromise().then(function (response) {
            $scope.currentVersion = angular.fromJson(response.data)[0];
            $scope.profileIconUrl = staticDataFactory.ddragonUrlPrefix() + $scope.currentVersion + staticDataFactory.profileIconPath();
        });

        $scope.promise = function () {

            return sharedPromise.getPromise();

        };

    })

    .service('sharedPromise', function () {
        var promise = null;

        return {
            getPromise: function () {
                return promise;
            },
            setPromise: function (value) {
                promise = value;
            }

        };

    });

