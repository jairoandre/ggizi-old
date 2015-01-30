angular.module('ggizi.champion', ['ggizi', 'ggizi.static', 'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ngSanitize'
])

    .config(function config($stateProvider) {
        $stateProvider.state('champion', {
            url: '/champion',
            views: {
                "main": {
                    controller: 'ChampionCtrl',
                    templateUrl: 'champion/champion.tpl.html'
                }
            },
            data: {pageTitle: 'Campeões'}
        });
    })

    .controller('ChampionCtrl', function ChampionController($scope, $http, staticDataFactory, sharedPromise) {

        $scope.api_key = 'bfea1361-9fff-45f8-a8c0-1ff8025da116';

        $scope.champion = null;

        $scope.champions = [];

        $scope.showChampionDiv = false;

        function init() {

            sharedPromise.setPromise(staticDataFactory.getChampions().then(function (response) {
                $scope.champions = angular.fromJson(response.data).data;
            }));

        }

        init();

        $scope.animateChampionDiv = function () {

            $scope.showChampionDiv = false;

            $http.get('http://httpbin.org/delay/0').then(function () {
                if ($scope.champion !== null) {
                    $scope.showChampionDiv = true;
                }
            });


        };

    }
).controller('ChampionCarousel', function ChampionCarousel($scope, $animate) {
        $scope.myInterval = -1;
    }).directive('disableNgAnimate', ['$animate', function ($animate) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $animate.enabled(false, element);
            }
        };
    }]);

