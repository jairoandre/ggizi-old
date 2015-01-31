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

        var summonerBaseUrl = 'https://br.api.pvp.net/api/lol/br/v1.4/summoner/';

        var apiKey = 'bfea1361-9fff-45f8-a8c0-1ff8025da116';

        var apiKeySufix = '?api_key=' + apiKey;

        /**
         * Recupera um summoner dado seu nome.
         * @param name
         * @returns {HttpPromise}
         */
        factory.getByName = function (name) {
            var url = summonerBaseUrl + 'by-name/' + name + '?api_key=' + apiKey;
            return $http.get(url);
        };

        /**
         * Transforma um mapeamento (id,id) de summoners em uma lista de string de ids, separados por vírgulas, e com a quantidade máxima de 40 por index.
         * Este tamanho é o máximo que a api aceita para recuperação de múltiplos summoners.
         *
         * @param playersId
         * @returns {Array}
         */
        factory.transformPlayersIdMapToList = function (playersId) {
            var i = 0;
            var j = 0;
            var ids = '';
            var idsList = [];

            angular.forEach(playersId, function (v, k) {

                ids += k;
                if (j++ < 39) {
                    ids += ',';
                } else {
                    idsList[i++] = ids;
                    j = 0;
                    ids = '';
                }
            });

            if(ids !== ''){
                idsList[i] = ids;
            }

            return idsList;
        };

        /**
         * Recupera os summoners dado uma lista de ids.
         *
         * @param ids
         */
        factory.playersByIds = function (ids) {
            return $http.get(summonerBaseUrl + ids + apiKeySufix);

        };

        factory.championById = function (championId) {
            var region = 'br';
            var url = 'https://br.api.pvp.net/api/lol/static-data/' + region + '/v1.2/champion/' + championId + '?champData=image&api_key=' + apiKey;
            return $http.get(url);
        };

        factory.profileIconUrl = function (version, iconUrl) {
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

        $scope.playersInfoMap = {};

        $scope.playersId = {};

        $scope.showHistory = false;

        function addOnSquareMap(championId) {
            if (!$scope.squareMap[championId]) {
                summonerFactory.championById(championId).then(function (response) {
                    $scope.squareMap[championId] = summonerFactory.championSquareUrl(angular.fromJson(response.data).image.full, $scope.currentVersion);
                });
            }
        }

        function addOnPlayersId(playerId) {
            if (!$scope.playersId[playerId]) {
                $scope.playersId[playerId] = playerId;
            }
        }

        if ($scope.summonerName && $scope.summonerName.length > 0) {
            // Carrega as informações do invocador
            summonerFactory.getByName($scope.summonerName).then(function (response) {

                $scope.summoner = angular.fromJson(response.data)[angular.lowercase($scope.summonerName)];

                // Resolve a url do ícone de invocador
                $scope.profileIconUrl = summonerFactory.profileIconUrl($scope.currentVersion, $scope.summoner.profileIconId);

                // Recupera os jogos recentes do invocador
                gameFactory.getRecentGames($scope.summoner.id).then(function (response) {

                    $scope.recentGames = angular.fromJson(response.data);

                    angular.forEach($scope.recentGames.games, function (game) {

                        addOnSquareMap(game.championId);

                        // Percorre a lista de jogadores que participaram do jogo
                        angular.forEach(game.fellowPlayers, function (player) {
                            addOnSquareMap(player.championId);
                            addOnPlayersId(player.summonerId);
                        });

                    });

                    $scope.idsList = summonerFactory.transformPlayersIdMapToList($scope.playersId);


                    angular.forEach($scope.idsList, function (ids) {
                        summonerFactory.playersByIds(ids).then(function(r){
                            $scope.playersInfoMap = angular.extend({}, $scope.playersInfoMap, angular.fromJson(r.data));
                            $scope.showHistory = true;
                        });
                    });
                });
            }); // getByName
        } // if
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

