$(document).ready(function() {
// =========
// APP STATE
// =========
  var appState = {
    // phase: reset, timer/question started, answerSubmitted, timerUp, noQuestionsLeft
    "phase":"reset",
    // timer variable that will hold the setTimeout in the start timer fxn so it can be stopped
    "timeout": null,
    "interval": null,
    "countdownTime": 5, //total seconds to answer


    "questionIndex": 0, 
    "currentQuestionObject": null,
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
      "answer": "a",
      "asked":0
    },
    {"question": "Q2 will go here",
      "a": "option a here",
      "b": "option b here",
      "c": "option c here",
      "d": "option d here",
      "answer": "d",
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
      gameplay.startTimer();
    },
    // start timer
    startTimer: function(){
      console.log("startTimer");
      // timer for overall question time
      appState.timer = setTimeout(gameplay.timeUp,1000*appState.countdownTime);
      // start/access an actual countdown of the seconds using setInterval
      // store in var so it can be stopped 
      appState.interval = setInterval(gameplay.countdownSeconds,  1000*1);
    },
    // start countdown (so timer will be displayed as a countdown )
    countdownSeconds: function() {
      if(appState.countdownTime > 0){
        appState.countdownTime--;
        console.log(appState.countdownTime);
      } else {
        gameplay.stopCountdown();
      }
    },

    stopCountdown: function() {
      clearInterval(appState.interval);
    },

    // pause timer (e.g. if answered before time up)
    pauseTimer: function() {
      clearTimeout(appState.timeout);
      gameplay.stopCountdown();
      console.log("timer and countdown paused!");
    },
    // reset timer
    resetTimer: function() {
      appState.countdownTime = 0;
      gameplay.resetTimer();
      gameplay.startTimer();
    },
    // reset countdown 
    // store correct answer (for display if incorrect or timer runs out)
    // check correct or incorrect answer
    timeUp: function() {
      console.log("check answer function called here");
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