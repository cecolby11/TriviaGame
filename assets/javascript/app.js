// ================
// APP STATE & DATA
// ================
var setup
var appState, data;

function resetAppState() {
  return {
    // possible phases: initialize, firstQuestion, getQuestion, waitingForAnswer, showResult, prepareForNext, endGame
    phase: "initialize",

    interval: null, // to hold the interval so it can be stopped 
    timeToAnswer: 10,
    timeBeforeNextQuestion: 5,

    questionIndex: 0,
    currentQuestionObject: null,
    userAnswer: null,
    result: null,

    scoreCounters: {
      correct: 0,
      incorrect: 0,
      unanswered: 0
    }
    // correctCounter: 0,
    // incorrectCounter: 0,
    // unansweredCounter: 0,
  };
}

function resetData() {
 return [
      {"question": "Q1 will go here",
        "options" : {
          "a": "SOME ANSWER HERE",
          "b": "ANOTHER ANSWER HERE",
          "c": "THIRD CHOICE HERE",
          "d": "FOURTH ONE",
          "e": "LAST"
        },
        "answer": "a", //gets the value stored in the key that "answer" points to
        "asked": false
      },
      {"question": "Q2 will go here",
        "options" : {
          "a": "I AM OPTION A",
          "b": "I AM OPTION B",
          "c": "I AM OPTION C",
          "d": "I AM OPTION D"
        },
        "answer": "d",
        "asked": false
      }
    ]
}

// initialize/reset game state 
function initializeApp() {
  console.log("initializeApp");
  appState = resetAppState();
  // sets PHASE to initialize
  data = resetData();
}

// ===============
// FUNCTIONS/LOGIC
// ===============

$(document).ready(function() {

  var gameplay = {

    beginGame: function() {
      //PHASE : initialize
      if(appState.phase !== "initialize") {
        initializeApp();
      }
      appState.phase = "firstQuestion";
      gameplay.startCountdown();
      browser.refreshDisplay();
    },

    selectNextQuestion: function() {
      //PHASE is prepareForNext
      if (appState.questionIndex < data.length){
      //set PHASE to waitingForAnswer
        appState.phase = "waitingForAnswer";
        appState.userAnswer = null;
        // get the next question object, update appState with the questionOBJECT (so it's easy to access its answers and options!)
        appState.currentQuestionObject = data[appState.questionIndex];
        //increment question index in preparation for next time 
        data[appState.questionIndex].asked = true;
        appState.questionIndex++;
        gameplay.startCountdown();
      } else {
        appState.phase = "endGame";
      }
      browser.refreshDisplay();
    },

    startCountdown: function() {
      //PHASE: waitingForAnswer or prepareForNext(or firstQuestion)
      // don't allow interval to be setup multiple times over itself 
      if(appState.interval === null) {
        if(appState.phase === "firstQuestion"){
          appState.interval = setInterval(function() {
            gameplay.countdownSeconds();
            browser.displayFirstCountdown();
          },1000*1)
        } else {
          appState.interval = setInterval(function() {
            gameplay.countdownSeconds();
            browser.renderCountdown();
          }, 1000*1);
        }
      } 
    },

    // start countdown (so timer will be displayed as a countdown )
    countdownSeconds: function() {
      //PHASE: waitingForAnswer or prepareForNext (or firstQuestion)
      if(appState.phase==="waitingForAnswer"){
        //if(appState.timeToAnswer > 0){
        if(appState.timeToAnswer > 0){
          appState.timeToAnswer--;
        } else {
          appState.phase = "showResult";
          gameplay.stopCountdown();
        }
      } 
      else if(appState.phase==="prepareForNext" || appState.phase === "firstQuestion"){
        if(appState.timeBeforeNextQuestion > 0){
          appState.timeBeforeNextQuestion--;
        } else {
          appState.phase = "getQuestion";
          gameplay.stopCountdown(); // every start call needs a stop call to clear the interval so it doesn't double up
        }
      } 
    },

    stopCountdown: function() {
      //PHASE: showResult
      clearInterval(appState.interval);
      gameplay.resetCountdown();
      if(appState.phase === "showResult") {
        gameplay.checkAnswer(appState.userAnswer);
      } 
      else if(appState.phase === "getQuestion") {
        gameplay.selectNextQuestion();
      } 
    },

    resetCountdown: function() {
      appState.timeToAnswer = 10;
      appState.timeBeforeNextQuestion = 5;
      // make sure to RESET the interval value too so it doesn't double up
      appState.interval = null;
    },

    checkAnswer: function(userAnswer) {
      //PHASE: showResult
      var correctAnswerKey = appState.currentQuestionObject.answer
      //look up the key's value
      var correctAnswerValue = appState.currentQuestionObject.options[correctAnswerKey];

      //if unanswered
      if (appState.userAnswer === null) {
        appState.result = "unanswered";
        appState.scoreCounters.unanswered++;
      }
      // if correct: 
      else if(appState.userAnswer === correctAnswerKey) {
        appState.result = "correct";
        appState.scoreCounters.correct++;
      }
      // if incorrect
      else if (appState.userAnswer !== correctAnswerKey) {
        appState.result = "incorrect";
        appState.scoreCounters.incorrect++;
      } 
      //show the result and correct answer if not selected
      browser.refreshDisplay();

      //wait some time and then call select next question
      // set PHASE to prepareForNext (for countdown)
      appState.phase = "prepareForNext";
      gameplay.startCountdown();

    }

  };

// ================
// EVENT MANAGEMENT
// ================
  // click start - begins game (start timer, select question, show question, etc.)

  // user clicks answer - processes answer
  // use jquery event management so it applies to buttons created in the future
  $(".choice-items-section").on("click", ".choice-item",function(){
    if(appState.phase === "waitingForAnswer"){
      //set phase to showResult
      appState.phase = "showResult";
      var selectedKey = $(this).attr("data-key");
      appState.userAnswer = selectedKey;
      gameplay.stopCountdown();
    }
  });

  // click start over button - resets game
  $(".start-button").on("click", function() {
    if(appState.phase === "initialize" || appState.phase === "endGame"){
      gameplay.beginGame();
    }
  })
  
// ========
// DISPLAY
// ========
  var browser = {
  // display and hide buttons
  // display timer
    renderQuestion: function(object) {
      $(".question-section").empty();
      var key = "question";
      if(object.hasOwnProperty(key)){
        value = object[key];
        var newHeader = $("<h1>" + value + "</h1>");
        newHeader.attr("data-key", key);
        $(".question-section").html(newHeader);
      }
    },

    renderChoiceItems: function(object) {
      $(".choice-items-section").empty();
      for(var i = 0; i < Object.keys(object.options).length; i++){
        var key = Object.keys(object.options)[i];
        if(object.options.hasOwnProperty(key)){
          var value = object.options[key];
          var newButton = $("<button>" + value + "</button>");
          newButton.attr("data-key",key);
          newButton.addClass("choice-item");
          $(".choice-items-section").append(newButton);
        }

      }
      // }
    },

    renderCountdown: function() {
      //refresh content each 1s interval
      $(".countdown-section").empty();
      if(appState.phase==="waitingForAnswer"){
        var time = appState.timeToAnswer;
        if(time >= 0){
          if(time < 10){time = "0" + time;}
          var newElement = $("<h2>Time remaining: 00:" + time + "</h2>");
        }
      } else if(appState.phase === "prepareForNext"){
        var time = appState.timeBeforeNextQuestion;
        if(time>0){
          var newElement = $("<h4>Next question in " + time + '</h4>');
        }
      }
      $(".countdown-section").append(newElement);
    },

    displayFirstCountdown: function() {
      if (appState.phase === "firstQuestion"){
        $(".countdown-section").empty();
        var time = appState.timeBeforeNextQuestion;
        if(time > 0){
          if(time<10){time = "0" + time;}
          var textA = $("<h2>Let's get started! You'll have " + appState.timeToAnswer + " seconds to answer each question.</h2>");
          var textB = $("<h3>Ready? Your first question will be revealed in 00:" + time + "</h3>");
        } 
        $(".countdown-section").append(textA).append(textB);
      }
    },

    displayResult: function() {
      var correctAnswerKey = appState.currentQuestionObject.answer
      var correctAnswerValue = appState.currentQuestionObject.options[correctAnswerKey];

      if (appState.result === "unanswered") {
        var newText = "Your time is up! The correct answer was " + correctAnswerValue;

      }
      // if correct: 
      else if(appState.result === "correct") {
        var newText = "Great job! " + correctAnswerValue + " is correct!";
      }
      // if incorrect
      else if (appState.result === "incorrect") {
        var newText = "Nope. The correct answer is " + correctAnswerValue;
      }

      var newElement = $("<h3>" + newText + "</h3>");
      newElement.addClass("result-text");
      $(".result-section").append(newElement); 
    },

    displayEndScore: function() {
      $(".score-value").remove();
      for(var i = 0; i < Object.keys(appState.scoreCounters).length; i++){
        var key = Object.keys(appState.scoreCounters)[i];
        if(appState.scoreCounters.hasOwnProperty(key)){
          var value = appState.scoreCounters[key];
          var newElement = $("<h4>" + value + "</h4>");
          newElement.attr("data-key",key);
          newElement.addClass("score score-value " + key);
          $("."+key).append(newElement);
        }
      }
    },

  // display whether correct or incorrect
    // display correct answer if incorrect
  // reset display for new game/game start

  //refresh display function to call all of these. --> call it in each function in the logic section
    refreshDisplay: function() {
      console.log("refresh!")
      $(".countdown-section").empty();
      $(".choice-items-section").empty();
      $(".result-section").empty();

      if(appState.phase !== "endGame" && appState.phase !== "initialize"){
        $(".start-button").addClass("hidden");
        $(".score-section").addClass("hidden");
      }

      if(appState.phase === "initialize"){

      }
      else if (appState.phase === "firstQuestion"){
        
      }
      else if(appState.phase === "getQuestion"){

      }
      else if(appState.phase === "waitingForAnswer"){
        console.log("HERE");
        browser.renderQuestion(appState.currentQuestionObject);
        browser.renderChoiceItems(appState.currentQuestionObject);
      }
      else if(appState.phase === "showResult"){
        browser.displayResult();
      }
      else if(appState.phase === "prepareForNext"){
        $(".question-section").empty();
      }
      else if(appState.phase === "endGame"){
        $(".question-section").empty();
        $(".score-section").removeClass("hidden");
        $(".start-button").removeClass("hidden");
        browser.displayEndScore();
      }
    }

  };

// =============
// INTIALIZE APP
// =============

  // call initialize app fxn 
  initializeApp();

});


// in order: 
// press start to start the game
// timer begins
// timer applies to that question, not the entire game
// display timer which is counting down
// display one question and answer options 
// user clicks answer
// timer stops
// game tells us if correct or incorrect
// gives correct answer if incorrect
// moves on to next question * with no user input * 
// resets timer and counts down, goes to next question
// if timer hits 0 before answer, shows we're out of time and shows correct answer
// with no user input, moves on to next question
// at end, shows total correct, incorrect, unanswered
// start over button
// resets the game when you click it, does not reload the page

// TODO: 
// pick question randomly
// get question that hasn't been asked yet by checking .asked value
// set countdown from 5 to a more reasonable number for each question
 // shorter countdown for between questions! use if else in start countdown based on appstate.phase