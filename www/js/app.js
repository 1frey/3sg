// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'chart.js'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: ''
      })

      .state('app.start', {
        url: "/start",
        views: {
          'menuContent': {
            templateUrl: "templates/start.html",
            controller: 'StartScreenCtrl',
          }
        }
      })

      .state('app.game', {
        url: "/game",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/game.html",
            controller: 'GameCtrl',
          }
        }
      })

      .state('app.result', {
        url: "/result",
        views: {
          'menuContent': {
            templateUrl: "templates/result.html",
            controller: 'ResultCtrl',
          }
        }
      })

      .state('app.statistics', {
        url: "/statistics",
        cache: false,
        views: {
          'menuContent': {
            templateUrl: "templates/statistics.html",
            controller: 'StatisticsCtrl',
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/start');
  })

  .directive('myDirective', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.height = element.prop('offsetHeight');
        scope.width = element.prop('offsetWidth');
      }
    };
  });

angular.module('starter.controllers', []);
angular.module('starter.services', []);
