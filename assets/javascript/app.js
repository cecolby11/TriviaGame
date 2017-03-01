$(document).ready(function() {
// =========
// APP STATE
// =========
  var appState = {
    // possible phases: initialize, getQuestion, waitingForAnswer, answeredInTime, unansweredInTime, prepareForNext, endGame
    "phase":"initialize",
    "interval": null, // to hold the interval so it can be stopped 
    "timeToAnswer": 6, //total seconds to answer
    "timeBeforeNextQuestion": 3, //time before next question

    "questionIndex": 0, 
    "currentQuestionObject": null,
    "userAnswer": null,
    // correct, incorrect, unanswered counters
    "correctCounter": 0,
    "incorrectCounter": 0,
    "unansweredCounter": 0,

    resetAppState : function() {
      appState.phase = "initialize";
      appState.interval = null;
      appState.questionIndex = 0;
      appState.currentQuestionObject = null;
      appState.userAnswer = null;
      appState.correctCounter =  0;
      appState.incorrectCounter = 0;
      appState.unansweredCounter = 0;
    }
  };

  var data = {
    //array of questions, options, and their answers, each as an object
    "questionObjects":[
    {"question": "Q1 will go here",
      "a": "option a here",
      "b": "option b here",
      "c": "option c here",
      "d": "option d here",
      "answer": "a", //gets the value stored in the key that "answer" points to
      "asked": false
    },
    {"question": "Q2 will go here",
      "a": "option a here",
      "b": "option b here",
      "c": "option c here",
      "d": "option d here",
      "answer": "d",
      "asked": false
    },
    ],

    resetData: function() {
      for(var i = 0; i < this.questionObjects.length; i++){
        data.questionObjects[i].asked = false;
      }
    }
  };

// ================
// EVENT MANAGEMENT
// ================
  // click start - begins game (start timer, select question, show question, etc.)

  // user clicks answer - processes answer
  $(".choice-item").on("click", function(){
    if(appState.phase === "waitingForAnswer"){
      //set phase to answeredInTime
      appState.phase = "answeredInTime";
      var selectedKey = $(this).attr("data-name");
      appState.userAnswer = selectedKey;
      gameplay.stopCountdown();
    }
  });

  // click start over button - resets game
  
// ===============
// FUNCTIONS/LOGIC
// ===============
  var gameplay = {
  // initialize/reset game state 
    initializeApp: function() {
      appState.resetAppState();
      data.resetData();
    },

    selectNextQuestion: function() {
      //PHASE is prepareForNext
      if (appState.questionIndex < data.questionObjects.length){
      //set PHASE to waitingForAnswer
        appState.phase = "waitingForAnswer";
        appState.userAnswer = null;
        // get the next question object, update appState with the questionOBJECT (so it's easy to access its answers and options!)
        appState.currentQuestionObject = data.questionObjects[appState.questionIndex];
        //increment question index in preparation for next time 
        data.questionObjects[appState.questionIndex].asked = true;
        appState.questionIndex++;
        console.log("current question: " + appState.currentQuestionObject.question);
        gameplay.startCountdown();
      } else {
        appState.phase = "endGame";
        gameplay.endGame();
      }
    },

    startCountdown: function() {
      //PHASE: waitingForAnswer
      console.log("start the clock");
      // don't allow interval to be setup multiple times over itself 
      if(appState.interval === null) {
        appState.interval = setInterval(gameplay.countdownSeconds, 1000*1);
      } else {
        console.log("there's somethign here!");
      }
    },

    // start countdown (so timer will be displayed as a countdown )
    countdownSeconds: function() {
      console.log("countdownSeconds phase " + appState.phase); 
      //PHASE: waitingForAnswer or prepareForNext
      if(appState.phase==="waitingForAnswer"){
        //if(appState.timeToAnswer > 0){
        if(appState.timeToAnswer > 0){
          appState.phase = "waitingForAnswer";
          appState.timeToAnswer--;
          console.log("seconds remaining: " + appState.timeToAnswer);
        } else {
          appState.phase = "unansweredInTime";
          gameplay.stopCountdown();
        }
      } 
      else if(appState.phase==="prepareForNext"){
        if(appState.timeBeforeNextQuestion > 0){
          appState.phase = "prepareForNext";
          appState.timeBeforeNextQuestion--;
          console.log(appState.timeBeforeNextQuestion);
        } else {
          appState.phase = "getQuestion";
          gameplay.stopCountdown(); // every start call needs a stop call to clear the interval so it doesn't double up
        }
      } 
    },

    stopCountdown: function() {
      console.log("clock stopped!");
      //PHASE: unansweredInTime or answeredInTime
      clearInterval(appState.interval);
      gameplay.resetCountdown();

      if(appState.phase === "answeredInTime" || appState.phase === "unansweredInTime") {
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
      console.log("checkAnswer");
      //PHASE: unansweredInTime or answeredInTime
      var correctAnswerKey = appState.currentQuestionObject.answer
      //look up the key's value
      var correctAnswerValue = appState.currentQuestionObject[correctAnswerKey];

      //if unanswered
      if (userAnswer === null) {
        console.log("Time's up! The correct answer was " + correctAnswerValue);
        appState.unansweredCounter++;
      }
      // if correct: 
      else if(userAnswer === correctAnswerKey) {
        console.log(correctAnswerValue + " is correct!");
        appState.correctCounter++;
      }
      // if incorrect
      else if (userAnswer !== correctAnswerKey) {
        console.log("Nope. The correct answer is " + correctAnswerValue);
        appState.incorrectCounter++;
      }

      // wait some amount of time (countdown) 

      //and then call select next question
      // set PHASE to prepareForNext
      appState.phase = "prepareForNext";
      gameplay.startCountdown();

    },

    endGame: function() {
      //PHASE: endGame
      console.log("gameover");
      console.log("correct: " + appState.correctCounter);
      console.log("incorrect: " + appState.incorrectCounter);
      console.log("unanswered: " + appState.unansweredCounter);
    }

  };
  
// ========
// DISPLAY
// ========
  var browser = {
  // display and hide buttons
  // display timer
  // display next question and display answer options (with no user input)
  // display whether correct or incorrect
    // display correct answer if incorrect
  // at end, display correct, incorrect, unanswered questions
  // reset display for new game/game start

  //refresh display function to call all of these. --> call it in each function in the logic section
  };

// =============
// INTIALIZE APP
// =============

  // call initialize app fxn 



  gameplay.selectNextQuestion();

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