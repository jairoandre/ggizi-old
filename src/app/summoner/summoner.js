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
                    },
                    "summonerHistory@summoner": {
                        templateUrl: 'summoner/summoner.history.tpl.html'
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
        
        /**
         * Recupera um summoner dado seu nome.
         * @param name
         * @returns {HttpPromise}
         */
        factory.summonerByName = function (name) {
            return $http.get(apiPath + 'summonerByName/' + name);
        };

        factory.summonerTierInfo = function(id) {
          return $http.get(apiPath + 'summonerTierInfo/' + id);
        };

        /**
         * Transforma um mapeamento (id,id) em uma lista de string de ids, separados por vírgulas, e com a quantidade máxima de 40 por index.
         * Este tamanho é o máximo que a api aceita para recuperação de múltiplos registros.
         *
         * @param idsMap
         * @returns {Array}
         */
        factory.transformIdMapToList = function (idsMap) {
            var i = 0;
            var j = 0;
            var ids = '';
            var summonersIdList = [];

            angular.forEach(idsMap, function (v, k) {

                ids += k;
                if (j++ < 39) {
                    ids += ',';
                } else {
                    summonersIdList[i++] = ids;
                    j = 0;
                    ids = '';
                }
            });

            if(ids !== ''){
                summonersIdList[i] = ids;
            }

            return summonersIdList;
        };

        /**
         * Recupera os summoners dado uma lista de ids.
         *
         * @param ids
         */
        factory.summonersByIds = function (ids) {
            return $http.get(apiPath + 'summonersByIds/' + ids);

        };

        factory.championsSquareMap = function (){
          return $http.get(apiPath + 'championsSquareMap');
        };

        factory.spellsSquareMap = function (){
            return $http.get(apiPath + 'summonerSpellsImageMap');
        };

        factory.profileIconUrl = function (version, iconUrl) {
            return 'http://ddragon.leagueoflegends.com/cdn/' + version + '/img/profileicon/' + iconUrl + '.png';

        };

        factory.championSquareUrl = function (squareUrl, currentVersion) {
            return 'http://ddragon.leagueoflegends.com/cdn/' + currentVersion + '/img/champion/' + squareUrl;
        };

        factory.gameTypeLabels = function(){
            return $http.get(apiPath + 'gameTypeLabels');
        };

        return factory;


    })

    .factory('gameFactory', function ($http) {

        var factory = {};

        factory.recentGamesBySummonerId = function (summonerId) {
            return $http.get(apiPath + 'recentGamesBySummonerId/' + summonerId);
        };

        return factory;


    })

    .controller('SummonerCtrl', function SummonerController($scope, $log, $stateParams, summonerFactory, gameFactory) {

        $log.log('SummonerCtrl instanced.');

        $scope.summonerName = $stateParams.summonerName;

        $scope.squareMap = {};

        $scope.summonersInfoMap = {};

        $scope.championsImageMap = {};

        $scope.summonersIdMap = {};

        $scope.showHistory = false;

        $scope.profileIconUrl = null;

        $scope.historyType = 'ALL';

        $scope.historyTypes = {};

        $scope.historyTypes['ALL'] = "Todos";
        $scope.historyTypes['^RANKED'] = "Ranked";

        $scope.errorMessage = null;


        summonerFactory.gameTypeLabels().then(function(r){
            $scope.gameTypeLabels = angular.fromJson(r.data);
        });


        function addOnPlayersIdMap(playerId) {
            if (!$scope.summonersIdMap[playerId]) {
                $scope.summonersIdMap[playerId] = playerId;
            }
        }

        if ($scope.summonerName && $scope.summonerName.length > 0) {

            // Carrega as informações do invocador (Primeiro request)
            summonerFactory.summonerByName($scope.summonerName).then(function (response) {

                $scope.summoner = angular.fromJson(response.data);

                summonerFactory.championsSquareMap().then(function (r){
                    $scope.championsSquareMap = angular.fromJson(r.data);
                });

                summonerFactory.spellsSquareMap().then(function (r){
                    $scope.spellsSquareMap = angular.fromJson(r.data);
                });

                summonerFactory.summonerTierInfo($scope.summoner.id).then(function (r){
                    $scope.summonerTierInfo = angular.fromJson(r.data);
                });

                // Resolve a url do ícone de invocador
                $scope.profileIconUrl = summonerFactory.profileIconUrl($scope.currentVersion, $scope.summoner.profileIconId);

                // Recupera os jogos recentes do invocador (Segundo Request)
                gameFactory.recentGamesBySummonerId($scope.summoner.id).then(function (response) {

                    $scope.recentGames = angular.fromJson(response.data);
                    $scope.showHistory = true;

                    // Para cada partida, preenche os maps dos champs e dos summoners que participaram.
                    /*angular.forEach($scope.recentGames, function (game) {

                        // Percorre a lista de jogadores que participaram do jogo
                        angular.forEach(game.fellowPlayers, function (player) {
                            addOnPlayersIdMap(player.summonerId);
                        });

                    });

                    // Transforma os mapeamentos para listas com o tamanho máximo permitido (40) por request
                    $scope.summonersIdList = summonerFactory.transformIdMapToList($scope.summonersIdMap);

                    // Para cada grupo de 40 ids, recupera as informações do grupo.
                    angular.forEach($scope.summonersIdList, function (ids) {
                        summonerFactory.summonersByIds(ids).then(function(r){
                            $scope.summonersInfoMap = angular.extend({}, $scope.summonersInfoMap, angular.fromJson(r.data));

                        });
                    });*/

                });
            }, function(response){
                $log.error(response.status);
                $scope.errorMessage = "Invocador não encontrado";
            }); // summonerByName
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

