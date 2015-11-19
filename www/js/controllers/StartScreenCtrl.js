angular.module('starter.controllers')
.controller('StartScreenCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state)
{
  $rootScope.score = JSON.parse(window.localStorage['score'] || '{}');

  $scope.startGame = function()
  {
    $state.go('app.game');
  }
}]);
