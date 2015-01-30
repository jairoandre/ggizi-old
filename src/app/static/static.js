angular.module('ggizi.static', [])

    .controller('StaticCtrl', function StaticController($scope, staticDataFactory) {

    })

    .factory('staticDataFactory', function ($http) {

        var factory = {};

        var baseUrl = 'https://br.api.pvp.net/api/lol/static-data/br/v1.2/';

        var apiKey = 'bfea1361-9fff-45f8-a8c0-1ff8025da116';

        factory.getChampions = function () {
            var url = baseUrl + 'champion?champData=image,skins,lore&api_key=' + apiKey;
            return $http.get(url);
        };

        factory.currentVersionPromise = function () {
            var url = baseUrl + 'versions?api_key=' + apiKey;
            return $http.get(url);
        };

        factory.ddragonUrlPrefix = function () {
            return 'http://ddragon.leagueoflegends.com/cdn/';
        };

        factory.profileIconPath = function (){
            return '/img/profileicon/';
        };

        return factory;

    });

