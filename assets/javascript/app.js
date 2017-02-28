$(document).ready(function() {
// =========
// APP STATE
// =========
  var appState = {
    // phase: initialize, waitingForAnswer, answered, unanswered, noQuestionsLeft
    "phase":"initialize",
    "interval": null, // to hold the interval so it can be stopped 
    "timeToAnswer": 3, //total seconds to answer
    "timeBeforeNextQuestion": 2, //time before next question

    "questionIndex": 0, 
    "currentQuestionObject": null,
    "userAnswer": null,
    // correct, incorrect, unanswered counters
    "correctCounter": 0,
    "incorrectCounter": 0,
    "unansweredCounter": 0 
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
      "asked":0
    },
    {"question": "Q2 will go here",
      "a": "option a here",
      "b": "option b here",
      "c": "option c here",
      "d": "option d here",
      "answer": function() {return this.d},
      "asked": false
    },
    ]
  };

// ================
// EVENT MANAGEMENT
// ================
  // click start - begins game (start timer, select question, show question, etc.)
  // user clicks answer - processes answer
  // click start over button - resets game
  
// ===============
// FUNCTIONS/LOGIC
// ===============
  var gameplay = {
  // initialize/reset game state 
    initializeApp: function() {
      appState.phase = "reset";
      appState.countdown = 0;
      appState.correctCounter = 0;
      appState.incorrectCounter = 0;
      appState.unansweredCounter = 0;
    },

    selectNextQuestion: function() {
      // get the next question object, update appState with the questionOBJECT (so it's easy to access its answers and options!)
      appState.currentQuestionObject = data.questionObjects[appState.questionIndex];
      //increment question index in preparation for next time 
      appState.questionIndex++;
      console.log("current question: " + appState.currentQuestionObject.question);
      console.log("index incremented to: " + appState.questionIndex);
      //gameplay.startTimer();
      gameplay.startCountdown();
    },

    startCountdown: function() {
      console.log("time on the clock: " + appState.timeToAnswer);
      appState.interval = setInterval(gameplay.countdownSeconds, 1000*1);
    },

    // start countdown (so timer will be displayed as a countdown )
    countdownSeconds: function() {
      if(appState.timeToAnswer > 0){
        appState.timeToAnswer--;
        console.log("seconds remaining: " + appState.timeToAnswer);
      } else {
        gameplay.stopCountdown();
        gameplay.checkAnswer(appState.userAnswer);
      }
    },

    stopCountdown: function() {
      clearInterval(appState.interval);
      gameplay.resetCountdownTimes();
    },

    resetCountdownTimes: function() {
      appState.timeToAnswer = 5;
      appState.timeBeforeNextQuestion = 3;
    },

    // shorter countdown for between questions! use if else in start countdown based on appstate.phase

    // store correct answer (for display if incorrect or timer runs out)

    checkAnswer: function(userAnswer) {
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

      // wait some amount of time (countdown) and then call select next question
    },


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