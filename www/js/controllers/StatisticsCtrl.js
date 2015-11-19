angular.module('starter.controllers')
.controller('StatisticsCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state)
{
  $rootScope.score = JSON.parse(window.localStorage['score'] || '{}');



  $scope.labels_bs = [];

  var count = 0;
  angular.forEach($rootScope.score.brainscoreList, function(value, key){
    count++;
    $scope.labels_bs.push(count);
  });

  $scope.series_bs = ['Brain Score'];
  $scope.data_bs = [
    $rootScope.score.brainscoreList
  ];

  $scope.labels_bt = [];

  count = 0;
  angular.forEach($rootScope.score.bestTimeList, function(value, key){
    count++;
    $scope.labels_bt.push(count);
  });

  $scope.series_bt = ['Best Time'];
  $scope.data_bt = [
    $rootScope.score.bestTimeList
  ];


  $scope.backButton = function()
  {
    $state.go('app.result');
  }

}]);
