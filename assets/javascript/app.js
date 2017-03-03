// ================
// APP STATE & DATA
// ================
var setup
var appState, data;

function resetAppState() {
  return {
    // possible phases: initial, getQuestion, waitingForAnswer, showResult, prepareForNext, endGame
    phase: "initial",

    interval: null, // to hold the interval so it can be stopped 
    timeToAnswer: 6,
    timeBeforeNextQuestion: 3,

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
  // sets PHASE to initial
  data = resetData();
}

// ===============
// FUNCTIONS/LOGIC
// ===============

$(document).ready(function() {

  var gameplay = {

    beginGame: function() {
      if(appState.phase !== "initial") {
        initializeApp();
      }
      appState.phase = "prepareForNext";
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
        console.log("current question: " + appState.currentQuestionObject.question);
        gameplay.startCountdown();
      } else {
        appState.phase = "endGame";
      }
      browser.refreshDisplay();
    },

    startCountdown: function() {
      //PHASE: waitingForAnswer
      console.log("start the clock");
      // don't allow interval to be setup multiple times over itself 
      if(appState.interval === null) {
        appState.interval = setInterval(function() {
          gameplay.countdownSeconds();
          browser.renderCountdown();
        }, 1000*1);
      } else {
        console.log("there's somethign here!");
      }
    },

    // start countdown (so timer will be displayed as a countdown )
    countdownSeconds: function() {
      //PHASE: waitingForAnswer or prepareForNext
      if(appState.phase==="waitingForAnswer"){
        //if(appState.timeToAnswer > 0){
        if(appState.timeToAnswer > 0){
          appState.phase = "waitingForAnswer";
          appState.timeToAnswer--;
        } else {
          appState.phase = "showResult";
          gameplay.stopCountdown();
        }
      } 
      else if(appState.phase==="prepareForNext"){
        if(appState.timeBeforeNextQuestion > 0){
          appState.phase = "prepareForNext";
          appState.timeBeforeNextQuestion--;
        } else {
          appState.phase = "getQuestion";
          gameplay.stopCountdown(); // every start call needs a stop call to clear the interval so it doesn't double up
        }
      } 
    },

    stopCountdown: function() {
      console.log("clock stopped!");
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
      appState.timeToAnswer = 5;
      appState.timeBeforeNextQuestion = 3;
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
        console.log("Time's up! The correct answer was " + correctAnswerValue);
        appState.result = "unanswered";
        appState.scoreCounters.unanswered++;
      }
      // if correct: 
      else if(appState.userAnswer === correctAnswerKey) {
        console.log(correctAnswerValue + " is correct!");
        appState.result = "correct";
        appState.scoreCounters.correct++;
      }
      // if incorrect
      else if (appState.userAnswer !== correctAnswerKey) {
        console.log("Nope. The correct answer is " + correctAnswerValue);
        appState.result = "incorrect";
        appState.scoreCounters.incorrect++;
      }

      // wait some amount of time (countdown) 
      browser.refreshDisplay();

      //and then call select next question
      // set PHASE to prepareForNext
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
    if(appState.phase === "initial" || appState.phase === "endGame"){
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
          var newText = $("<h2>Time remaining: 00:" + time + "</h2>");
        }
      } 
      else if(appState.phase==="prepareForNext"){
        var time = appState.timeBeforeNextQuestion;
        if(time > 0){
          if(time<10){time = "0" + time;}
          var newText = $("<h5>Next question revealed in 00:" + time + "</h5>");
        } else {
          //
        }
      }
      $(".countdown-section").append(newText);
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
      $(".countdown-section").empty();
      $(".choice-items-section").empty();
      $(".question-section").empty();
      $(".result-section").empty();

      if(appState.phase !== "endGame" && appState.phase !== "initial"){
        $(".start-button").addClass("hidden");
        $(".score-section").addClass("hidden");
      }

      if(appState.phase === "initial"){

      }
      else if(appState.phase === "getQuestion"){
        
      }
      else if(appState.phase === "waitingForAnswer"){
        browser.renderQuestion(appState.currentQuestionObject);
        browser.renderChoiceItems(appState.currentQuestionObject);
      }
      else if(appState.phase === "showResult"){
        browser.displayResult();
      }
      else if(appState.phase === "prepareForNext"){

      }
      else if(appState.phase === "endGame"){
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