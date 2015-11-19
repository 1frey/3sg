angular.module('starter.controllers')
.controller('ResultCtrl', ['$scope', '$rootScope', '$state', 'BSCalculatorService', function($scope, $rootScope, $state, BSCalculatorService)
{
  $scope.bestTimeListLimit = 50;

  $scope.yourGeometrySelectionURL;

  // won game?
  if($rootScope.questions[0].correct && $rootScope.questions[1].correct && $rootScope.questions[2].correct)
  {

    // store besttime
    if ($rootScope.score.bestTime)
    {
      if (parseFloat($rootScope.myTime.toFixed(2)) < $rootScope.score.bestTime)
      {
        $rootScope.score.bestTime =  parseFloat($rootScope.myTime.toFixed(2));
      }
      console.log($rootScope.score.bestTime);
    }
    else
    {
      console.log("no score");
      $rootScope.score.bestTime = parseFloat($rootScope.myTime.toFixed(2));
      window.localStorage['score'] = JSON.stringify($rootScope.score);
    }

    // best time array
    if($rootScope.score.bestTimeList)
    {
      $rootScope.score.bestTimeList.push(parseFloat($rootScope.myTime.toFixed(2)));
      if($rootScope.score.bestTimeList.length > $scope.bestTimeListLimit)
      {
        $rootScope.score.bestTimeList.shift();
      }
    }
    else
    {
      $rootScope.score.bestTimeList = [];
      $rootScope.score.bestTimeList.push(parseFloat($rootScope.myTime.toFixed(2)));
    }

    // store hits
    if ($rootScope.score.hits)
    {
      $rootScope.score.hits++;
    }
    else
    {
      $rootScope.score.hits = 1;
    }
  }

  // store tries
  if ($rootScope.score.tries)
  {
    $rootScope.score.tries++;
  }
  else
  {
    $rootScope.score.tries = 1;
  }

  // calculate brain score
  $scope.brainScore = BSCalculatorService.calculate();

  // store brain score
  if ($rootScope.score.brainscoreList)
  {
    $rootScope.score.brainscoreList.push($scope.brainScore.toFixed(0));
  }
  else
  {
    $rootScope.score.brainscoreList = [$scope.brainScore.toFixed(0)];
  }

  // store
  window.localStorage['score'] = JSON.stringify($rootScope.score);

  angular.forEach($rootScope.geometries, function(value, key){
    if($rootScope.questions[0].userSelection == value.frontview
      && $rootScope.questions[1].userSelection == value.topview
      && $rootScope.questions[2].userSelection == value.color)
    {
      console.log("YOURS: " + value.img);
      $scope.yourGeometrySelectionURL = value.img;
    }
  });

  $scope.restartGame = function()
  {
    $state.go('app.game');
  }

  $scope.openStatistics = function()
  {
    $state.go('app.statistics');
  }

  $scope.clearData = function()
  {
    $rootScope.score.bestTimeList = [];
    $rootScope.score.brainscoreList = [];
    $rootScope.score.bestTime = 0;
    $rootScope.score.tries = 0;
    $rootScope.score.hits = 0;
    window.localStorage['score'] = JSON.stringify($rootScope.score);
  }

  $scope.bestTimeAvg = function()
  {
    return BSCalculatorService.bestTimeAvg();
  }

}]);
