angular.module('ggizi.static', [])

    .controller('StaticCtrl', function StaticController($scope, staticDataFactory) {

    })

    .factory('staticDataFactory', function ($http) {

        var factory = {};

        factory.getChampions = function () {
            return $http.get('/api/championList');
        };

        factory.currentVersion = function () {
            return $http.get("/api/currentVersion");
        };

        factory.ddragonUrlPrefix = function () {
            return 'http://ddragon.leagueoflegends.com/cdn/';
        };

        factory.profileIconPath = function (){
            return '/img/profileicon/';
        };

        return factory;

    });

