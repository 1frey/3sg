angular.module('starter.services')
.service('BSCalculatorService', ['$rootScope', function($rootScope) {

  this.calculate = function()
  {
    var winRate = ($rootScope.score.tries-$rootScope.score.hits) / $rootScope.score.tries;
    var avgBestTime = this.bestTimeAvg();
    if(avgBestTime < 1)
    {
      avgBestTime = 1;
    }

    var bestTimeFactor = this.mapRange(avgBestTime, 1, 3, 0, 3) / 3;
    var skillLevel = 1.0;

    var part1 = winRate * 100;
    var part2 = bestTimeFactor * 100;

    var bs = 100 - (part1/2 + part2/2) * skillLevel;

    console.log("winrate: " + winRate + ", BTF: " + bestTimeFactor + ", part1: " + part1 + ", part2: " + part2 + ", BS: " + bs);

    return bs;
  }

  this.mapRange = function(value, leftMin, leftMax, rightMin, rightMax)
  {
    // Figure out how 'wide' each range is
    var leftSpan = leftMax - leftMin;
    var rightSpan = rightMax - rightMin;
    // Convert the left range into a 0-1 range
    var valueScaled = (value - leftMin) / leftSpan;
    // Convert the 0-1 range into a value in the right range.
    return (rightMin + (valueScaled * rightSpan));
  }

  this.bestTimeAvg = function()
  {
    if($rootScope.score.bestTimeList)
    {
      if($rootScope.score.bestTimeList.length == 0)
      {
        return 3;
      }

      var avg = 0;
      angular.forEach($rootScope.score.bestTimeList, function(value, key)
      {
        avg += value;
        console.log(value + " avg: " + avg);
      });
      avg /= $rootScope.score.bestTimeList.length;
      console.log("total avg: " + avg);
      return avg;
    }
    else
    {
      return 3;
    }
  }

}]);
