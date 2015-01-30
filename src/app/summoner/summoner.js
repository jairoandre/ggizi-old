angular.module('ggizi.summoner', [
    'ggizi',
    'ui.router',
    'ngAnimate',
    'ngSanitize'
])

    .config(function config($stateProvider) {
        $stateProvider

            .state('summoner', {
                url: '/summoner',
                views: {
                    "main": {
                        templateUrl: 'summoner/summoner.tpl.html'
                    },
                    "summonerSearch@summoner": {
                        templateUrl: 'summoner/summoner.search.tpl.html'
                    }
                },
                data: {pageTitle: 'Summoner'}
            })

            .state('summoner.info', {
                url: "/:summonerName",
                templateUrl: 'summoner/summoner.tpl.html'
            });
    })

    .factory('summonerFactory', function ($http, $q, $log) {

        var factory = {};

        var apiKey = 'bfea1361-9fff-45f8-a8c0-1ff8025da116';

        factory.getByName = function (name) {
            var baseUrl = 'https://br.api.pvp.net/api/lol/br/v1.4/summoner/';
            var url = baseUrl + 'by-name/' + name + '?api_key=' + apiKey;
            return $http.get(url);
        };

        factory.playerById = function(id) {

        };

        factory.championById = function (championId) {
            var region = 'br';
            var url = 'https://br.api.pvp.net/api/lol/static-data/' + region + '/v1.2/champion/' + championId + '?champData=image&api_key=' + apiKey;
            return $http.get(url);
        };

        factory.profileIconUrl = function(version, iconUrl){
            return 'http://ddragon.leagueoflegends.com/cdn/' + version + '/img/profileicon/' + iconUrl + '.png';

        };

        factory.championSquareUrl = function (squareUrl, currentVersion) {
            return 'http://ddragon.leagueoflegends.com/cdn/' + currentVersion + '/img/champion/' + squareUrl;
        };

        return factory;


    })

    .factory('gameFactory', function ($http) {

        var factory = {};

        var baseUrl = 'https://br.api.pvp.net/api/lol/br/v1.3/game/by-summoner/';

        var sufixUrl = '/recent';

        var apiKey = 'bfea1361-9fff-45f8-a8c0-1ff8025da116';

        factory.getRecentGames = function (summonerId) {
            var url = baseUrl + summonerId + sufixUrl + '?api_key=' + apiKey;
            return $http.get(url);
        };

        return factory;


    })

    .controller('SummonerCtrl', function SummonerController($scope, $log, $stateParams, summonerFactory, gameFactory) {

        $log.log('SummonerCtrl instanced.');

        $scope.summonerName = $stateParams.summonerName;

        $scope.squareMap = {};

        $scope.playerInfoMap = {};

        $scope.playersId = {};

        function addOnSquareMap(championId){
            if(!$scope.squareMap[championId]){
                summonerFactory.championById(championId).then(function(response){
                    $scope.squareMap[championId] = summonerFactory.championSquareUrl(angular.fromJson(response.data).image.full, $scope.currentVersion);
                });
            }
        }

        function addOnPlayerInfoMap(playerId){

        }

        if ($scope.summonerName && $scope.summonerName.length > 0) {
            // Carrega as informações do invocador
            summonerFactory.getByName($scope.summonerName).then(function (response) {

                $scope.summoner = angular.fromJson(response.data)[angular.lowercase($scope.summonerName)];

                // Resolve a url do ícone de invocador
                $scope.profileIconUrl = summonerFactory.profileIconUrl($scope.currentVersion, $scope.summoner.profileIconId);

                gameFactory.getRecentGames($scope.summoner.id).then(function (response) {
                    $scope.recentGames = angular.fromJson(response.data);
                    angular.forEach($scope.recentGames.games, function(game){

                        addOnSquareMap(game.championId);

                        angular.forEach(game.fellowPlayers, function(player){

                            addOnSquareMap(player.championId);
                        });

                    });

                });
            });
        }

    })


    .directive('ggiziSearch', function ($state) {
        return function (scope, element) {
            element.bind("keydown", function (event) {
                if (event.which === 13) {
                    $state.go('summoner.info', {summonerName: scope.summonerName}, {reload: true});
                    event.preventDefault();
                }
            });
        };
    });

