angular.module('starter.controllers')
.controller('GameCtrl', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state)
{
  $scope.isLoading = false;
  $scope.isSuccessful = false;
  $scope.percentLoaded = 0;

  $scope.GAME_STATES = {
    PREVIEWING : 0,
    HOLDING : 1,
    QUESTIIONING : 2,
    STOPPED: 3
  };

  $scope.currentGameState = $scope.GAME_STATES.PREVIEWING;

  $scope.previewImageSwitchTime = 200; // in msec
  $scope.previewRuntime = 0;  // in sec
  $scope.previewMaxRuntime = 3; // in sec

  $scope.gameRunTime = 0;
  $scope.gameMaxTime = 3; // in sec

  $scope.holdingRunTime = 0;
  $scope.holdingMaxTime = 1; // in sec

  $scope.lastTime = 0;
  $scope.timeCounterPreviewImage = 0;

  $scope.currentQuestionIndex = 0;

  $scope.startTime;
  $scope.endTime;

  $rootScope.myTime = 3;  // in sec
  $rootScope.isTimeOver = false;

  $scope.randomIndex = 0; // the random index for geometries
  $rootScope.currentGeometryURL;

  $rootScope.geometries = [
    {"id":1, "geometry":"cube", "img":"img/geometries/original/1_Wuerfel_blau.jpg", "frontview":1, "topview":1, "color":0},
    {"id":2, "geometry":"cube", "img":"img/geometries/original/1_Wuerfel_gruen.jpg", "frontview":1, "topview":1, "color":1},
    {"id":3, "geometry":"cube", "img":"img/geometries/original/1_Wuerfel_rot.jpg", "frontview":1, "topview":1, "color":2},
    {"id":4, "geometry":"rectangle", "img":"img/geometries/original/2_Rechteck_blau.jpg", "frontview":1, "topview":3, "color":0}
  ];

  $rootScope.questions = [
    {"text":"FRONT VIEW?", "correct":false, "userSelection":0, "img":"hint1", "disableLastButton":false, "img_button1":"answer1_button1", "img_button2":"answer1_button2", "img_button3":"answer1_button3", "img_button4":"answer1_button4"},
    {"text":"TOP VIEW?", "correct":false, "userSelection":0, "img":"hint2", "disableLastButton":false, "img_button1":"answer1_button1", "img_button2":"answer1_button2", "img_button3":"answer1_button3", "img_button4":"answer1_button4"},
    {"text":"COLOR?", "correct":false, "userSelection":0, "img":"hint3", "disableLastButton":true, "img_button1":"answer3_button1", "img_button2":"answer3_button2", "img_button3":"answer3_button3", "img_button4":""}
  ];


  $scope.currentQuestionIndex = 0;

  // CREATE PHASER INSTANCE

  $scope.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'gameStage', { preload: preload, create: create, update: update, render: render });

  $scope.scaleFactor = 1;

  // sprites
  $scope.logoSprite;
  $scope.geometry;
  $scope.hintSprite;

  $scope.buttonGroup;
  $scope.button;
  $scope.button2;
  $scope.button3;
  $scope.button4;

  $scope.progressBar;

  // text
  $scope.readyText;

  $scope.graphics;

  function preload()
  {
    $scope.game.load.image('logo', 'img/logo_small.png');
    $scope.game.load.spritesheet('answer1_button1', 'img/buttons/answer1_button1.jpg', 200, 200);
    $scope.game.load.spritesheet('answer1_button2', 'img/buttons/answer1_button2.jpg', 200, 200);
    $scope.game.load.spritesheet('answer1_button3', 'img/buttons/answer1_button3.jpg', 200, 200);
    $scope.game.load.spritesheet('answer1_button4', 'img/buttons/answer1_button4.jpg', 200, 200);
    $scope.game.load.spritesheet('answer3_button1', 'img/buttons/answer3_button1.jpg', 200, 200);
    $scope.game.load.spritesheet('answer3_button2', 'img/buttons/answer3_button2.jpg', 200, 200);
    $scope.game.load.spritesheet('answer3_button3', 'img/buttons/answer3_button3.jpg', 200, 200);
    $scope.game.load.image('hint1', 'img/hints/hint1.jpg');
    $scope.game.load.image('hint2', 'img/hints/hint2.jpg');
    $scope.game.load.image('hint3', 'img/hints/hint3.jpg');

    // load all geometries
    angular.forEach($rootScope.geometries, function(value, key){
      $scope.game.load.image('geo_' + value.id, value.img);
    });
  }

  function create()
  {
    $scope.game.stage.backgroundColor = '#72AC62';

    $scope.scaleFactor = ((100/1000) * window.innerHeight) / 100;



    var graphics = $scope.game.add.graphics(0, 0);


    // MIDDLE

    var graphics = $scope.game.add.graphics(0, 0);
    $scope.graphics = graphics;

    graphics.beginFill(0x3E463C, 1);
    graphics.drawRect(0, window.innerHeight * 0.25, window.innerWidth, window.innerHeight * 0.5);

    $scope.hintSprite = $scope.game.add.sprite(window.innerWidth/2, window.innerHeight/2, '');
    $scope.hintSprite.anchor.setTo(0.5, 0.5);
    $scope.hintSprite.scale.setTo($scope.scaleFactor*0.4, $scope.scaleFactor*0.4);

	var questionTextStyle = { font: "CubanoRegular", fill: "#ffffff", align: "center", fontSize: "30px"};
    $scope.questionText = $scope.game.add.text($scope.game.world.centerX, (window.innerHeight * 0.75) - 50, "[QUESTION]", questionTextStyle);
    $scope.questionText.anchor.set(0.5);

    // draw geometry

    $scope.geometry = $scope.game.add.sprite(window.innerWidth/2, window.innerHeight/2, '');
    $scope.geometry.anchor.setTo(0.5, 0.5);
    $scope.geometry.scale.setTo($scope.scaleFactor*0.4, $scope.scaleFactor*0.4);
    $scope.geometry.visible = false;

    // draw borders

    graphics.beginFill(0x679B59, 1);
    graphics.drawRect(0, window.innerHeight * 0.25, window.innerWidth, 5);
    graphics.beginFill(0x373F35, 1);
    graphics.drawRect(0, window.innerHeight * 0.25 + 5, window.innerWidth, 5);
    graphics.beginFill(0x373F35, 1);
    graphics.drawRect(0, window.innerHeight * 0.75, window.innerWidth, 5);
    graphics.beginFill(0x679B59, 1);
    graphics.drawRect(0, window.innerHeight * 0.75 + 5, window.innerWidth, 5);


    // LOGO

    $scope.logoSprite = $scope.game.add.sprite(window.innerWidth/2, 15, 'logo');
    $scope.logoSprite.anchor.setTo(0.5, 0.0);


    $scope.logoSprite.scale.setTo($scope.scaleFactor, $scope.scaleFactor);

    // BOTTOM

    var style = { font: "CubanoRegular", fill: "#ffcc33", align: "center", fontSize: "40px"};
    $scope.readyText = $scope.game.add.text($scope.game.world.centerX, (window.innerHeight * 0.75) + (window.innerHeight - (window.innerHeight * 0.75))/2, "BE READY!", style);
    $scope.readyText.anchor.set(0.5);


    createButtons();





  }

  function update()
  {
    var timeElapsed = this.game.time.totalElapsedSeconds();
    var timeDiff = timeElapsed - $scope.lastTime;

    $scope.lastTime = timeElapsed;

    // PREVIEWING

    if($scope.currentGameState == $scope.GAME_STATES.PREVIEWING)
    {
      $scope.timeCounterPreviewImage += timeDiff;

      $scope.previewRuntime += timeDiff;

      // update preview image
      if($scope.timeCounterPreviewImage >= $scope.previewImageSwitchTime/1000)
      {
        var newIndex = parseInt(Math.random() * $scope.geometries.length, 10);
        while(newIndex == $scope.randomIndex)
        {
          newIndex = parseInt(Math.random() * $scope.geometries.length, 10);
        }
        $scope.randomIndex = newIndex;

        $scope.timeCounterPreviewImage = 0;
        $scope.geometry.loadTexture("geo_" + $scope.geometries[$scope.randomIndex].id);
        $rootScope.currentGeometryURL = $scope.geometries[$scope.randomIndex].img;
      }

      // preview finished?
      if($scope.previewRuntime >= $scope.previewMaxRuntime)
      {
        console.log("Preview finished");
        $scope.currentGameState = $scope.GAME_STATES.HOLDING;
      }
    }

    // HOLDING

    if($scope.currentGameState == $scope.GAME_STATES.HOLDING)
    {
      $scope.holdingRunTime += timeDiff;

      if ($scope.holdingRunTime >= $scope.holdingMaxTime)
      {
        console.log("Holding finished");
        $scope.currentGameState = $scope.GAME_STATES.QUESTIIONING;
      }
    }

    // QUESTIONING

    if($scope.currentGameState == $scope.GAME_STATES.QUESTIIONING)
    {
      $scope.gameRunTime += timeDiff;

      if ($scope.gameRunTime >= $scope.gameMaxTime)
      {
        $scope.currentGameState = $scope.GAME_STATES.STOPPED;
        console.log("Time over");
        $rootScope.isTimeOver = true;
        $rootScope.myTime = 3;
        $scope.questions[0].userSelection = -1;
        $scope.questions[1].userSelection = -1;
        $scope.questions[2].userSelection = -1;
        $scope.clearGame();
        $state.go('app.result');
      }
    }



    // VIEW STATES
    if($scope.currentGameState == $scope.GAME_STATES.PREVIEWING)
    {
      $scope.readyText.visible = true;
      $scope.geometry.visible = true;
      $scope.buttonGroup.visible = false;
      $scope.questionText.visible = false;
      $scope.hintSprite.visible = false;
    }
    else if($scope.currentGameState == $scope.GAME_STATES.HOLDING)
    {
      $scope.readyText.visible = true;
      $scope.geometry.visible = true;
      $scope.buttonGroup.visible = false;
      $scope.questionText.visible = false;
      $scope.hintSprite.visible = false;
    }
    else
    {
      $scope.readyText.visible = false;
      $scope.geometry.visible = false;
      $scope.buttonGroup.visible = true;
      $scope.questionText.visible = true;
      $scope.hintSprite.visible = true;
    }

    // update button position

    var question = $scope.questions[$scope.currentQuestionIndex];
    var numberOfButtons = 4;

    if(question.disableLastButton)
    {
      numberOfButtons = 3;
    }

    var a = window.innerWidth/numberOfButtons;
    var b = a/2;
    $scope.button.position.x = a - b;
    $scope.button2.position.x = 2*a - b;
    $scope.button3.position.x = 3*a - b;
    if(!question.disableLastButton)
    {
      $scope.button4.position.x = 4*a - b;
      $scope.button4.visible = true;

    }
    else
    {
      $scope.button4.visible = false;
    }

    // update question text
    $scope.questionText.text = question.text;
  }

  function render()
  {
    if($scope.currentGameState == $scope.GAME_STATES.QUESTIIONING)
    {
      $scope.graphics.beginFill(0xFF0000, 1);
      var barSize = (((100/$scope.gameMaxTime) * $scope.gameRunTime) / 100) * window.innerWidth;
      $scope.graphics.drawRect(0, window.innerHeight * 0.75 - 15, barSize, 15);
    }
  }

  function answerA()
  {
    giveAnswer(0);
  }

  function answerB()
  {
    giveAnswer(1);
  }

  function answerC()
  {
    giveAnswer(2);
  }

  function answerD()
  {
    giveAnswer(3);
  }

  function giveAnswer(buttonIndex)
  {
    $scope.questions[$scope.currentQuestionIndex].userSelection = buttonIndex;

    if($scope.currentQuestionIndex == 0)
    {
      if($rootScope.geometries[$scope.randomIndex].frontview == buttonIndex)
      {
        $rootScope.questions[0].correct = true;
      }
      else
      {
        $rootScope.questions[0].correct = false;
      }
    }
    else if($scope.currentQuestionIndex == 1)
    {
      if($rootScope.geometries[$scope.randomIndex].topview == buttonIndex)
      {
        $rootScope.questions[1].correct = true;
      }
      else
      {
        $rootScope.questions[1].correct = false;
      }
    }
    else if($scope.currentQuestionIndex == 2)
    {
      if($rootScope.geometries[$scope.randomIndex].color == buttonIndex)
      {
        $rootScope.questions[2].correct = true;
      }
      else
      {
        $rootScope.questions[2].correct = false;
      }
    }

    if($scope.currentQuestionIndex+1 >= $scope.questions.length)
    {
      $scope.currentGameState = $scope.GAME_STATES.STOPPED;
      console.log("FINISHED");
      $rootScope.myTime = $scope.gameRunTime;
      $rootScope.isTimeOver = false;
      $scope.clearGame();
      $state.go('app.result');
    }
    else
    {
      $scope.currentQuestionIndex++;
    }

    createButtons();
  }

  function createButtons()
  {


    $scope.buttonGroup = $scope.game.add.group();

    var a = window.innerWidth/4;
    var b = a/2;

    var question = $scope.questions[$scope.currentQuestionIndex];

    $scope.hintSprite.loadTexture(question.img);

    if (typeof($scope.button) != "undefined")
    {
      $scope.button.kill();
    }
    $scope.button = $scope.game.add.button(0, 0, question.img_button1, answerA, this, 0, 0, 1);
    $scope.button.scale.setTo($scope.scaleFactor/1.5, $scope.scaleFactor/1.5);
    $scope.button.anchor.set(0.5);
    $scope.button.anchor.setTo(0.5, 0.5);
    $scope.button.position.x = a - b;
    $scope.button.position.y = (window.innerHeight * 0.75) + (window.innerHeight - (window.innerHeight * 0.75))/2;
    $scope.buttonGroup.add($scope.button);

    if (typeof($scope.button2) != "undefined")
    {
      $scope.button2.kill();
    }
    $scope.button2 = $scope.game.add.button(0, 0, question.img_button2, answerB, this, 0, 0, 1);
    $scope.button2.scale.setTo($scope.scaleFactor/1.5, $scope.scaleFactor/1.5);
    $scope.button2.anchor.setTo(0.5, 0.5);
    $scope.button2.position.x = 2*a - b;
    $scope.button2.position.y = (window.innerHeight * 0.75) + (window.innerHeight - (window.innerHeight * 0.75))/2;
    $scope.buttonGroup.add($scope.button2);

    if (typeof($scope.button3) != "undefined")
    {
      $scope.button3.kill();
    }
    $scope.button3 = $scope.game.add.button(0, 0, question.img_button3, answerC, this, 0, 0, 1);
    $scope.button3.scale.setTo($scope.scaleFactor/1.5, $scope.scaleFactor/1.5);
    $scope.button3.anchor.setTo(0.5, 0.5);
    $scope.button3.position.x = 3*a - b;
    $scope.button3.position.y = (window.innerHeight * 0.75) + (window.innerHeight - (window.innerHeight * 0.75))/2;
    $scope.buttonGroup.add($scope.button3);

    if (typeof($scope.button4) != "undefined")
    {
      $scope.button4.kill();
    }
    $scope.button4 = $scope.game.add.button(0, 0, question.img_button4, answerD, this, 0, 0, 1);
    $scope.button4.scale.setTo($scope.scaleFactor/1.5, $scope.scaleFactor/1.5);
    $scope.button4.anchor.setTo(0.5, 0.5);
    $scope.button4.position.x = 4*a - b;
    $scope.button4.position.y = (window.innerHeight * 0.75) + (window.innerHeight - (window.innerHeight * 0.75))/2;
    $scope.buttonGroup.add($scope.button4);
  }

  $scope.clearGame = function()
  {
    $scope.game.destroy();
  }

}]);
