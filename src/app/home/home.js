angular.module('ggizi.home', [
    'ui.router',
    'plusOne'
])

    .config(function config($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            views: {
                "main": {
                    templateUrl: 'home/home.tpl.html'
                },
                "summonerSearch@home": {
                    templateUrl: 'summoner/summoner.search.tpl.html'
                }
            },
            data: {pageTitle: 'Home'}
        });
    })

    .controller('HomeCtrl', function HomeController($scope, $http) {

    });

