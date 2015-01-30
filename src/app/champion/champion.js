angular.module('ggizi.champion', [
    'ggizi',
    'ggizi.static',
    'ui.router',
    'ngAnimate',
    'ngSanitize'
])

    .config(function config($stateProvider) {
        $stateProvider.state('champion', {
            url: '/champion',
            views: {
                "main": {
                    templateUrl: 'champion/champion.tpl.html'
                }
            },
            data: {pageTitle: 'Champions'}
        });
    })

    .controller('ChampionCtrl', function ChampionController($scope, $http, $log, staticDataFactory) {

        $log.info('ChampionCtrl instanced.');

        $scope.api_key = 'bfea1361-9fff-45f8-a8c0-1ff8025da116';

        $scope.champions = null;

        $scope.champion = null;

        $scope.selectedChampion = null;

        $scope.showChampionDiv = false;

        function init() {

            staticDataFactory.getChampions().then(function (response) {
                $scope.champions = angular.fromJson(response.data).data;
            });

        }

        init();

        // Simula o loading de tela
        $scope.changeChampion = function () {

            $scope.selectedChampion = null;

            $http.get('http://httpbin.org/delay/1').then(function () {
                $scope.selectedChampion = $scope.champion;
            });


        };

    }
).controller('ChampionCarousel', function ChampionCarousel($scope) {
        $scope.myInterval = -1;
    }).directive('disableNgAnimate', ['$animate', function ($animate) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $animate.enabled(false, element);
            }
        };
    }]);

