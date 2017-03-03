// ================
// APP STATE & DATA
// ================
var appState, data;

function resetAppState() {
  return {
    // possible phases: initialize, firstQuestion, getQuestion, waitingForAnswer, showResult, prepareForNext, endGame
    phase: 'initialize',

    interval: null, // to hold the interval so it can be stopped 
    timeToAnswer: 30,
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
      {'question': 'a typical serving of milk chocolate has the same amount of caffeine as a...',
        'options' : {
          'a': 'bottle of coke',
          'b': 'cup of regular coffee',
          'c': 'cup of black tea',
          'd': 'cup of decaf coffee'
        },
        'answer': 'd'
      },
      {'question': 'Which milk chocolate ingredient is missing in white chocolate?',
        'options' : {
          'a': 'sugar',
          'b': 'vanilla',
          'c': 'cocoa butter',
          'd': 'cocoa liquor',
        },
        'answer': 'd'
      },
      {'question': 'There\'s a correlation a country\'s chocolate consumption and number of...',
      'options' : {
          'a': 'Olive varieties',
          'b': 'Golf Courses',
          'c': 'Newspapers',
          'd': 'Sommeliers',
          'e': 'Nobel Laureates',
          'f': 'Fresh Lemon Imports'
        },
        'answer': 'e'
      },
      {'question': 'It takes about ___ cacao beans to make 1lb of chocolate',
        'options' : {
          'a': '50',
          'b': '200',
          'c': '500',
          'd': '900'
        },
        'answer': 'b'
      },
      {'question': 'Milton Hersey\'s first love was...',
        'options': {
          'a': 'Chocolate',
          'b': 'Coffee',
          'c': 'Chili',
          'd': 'Caramel',
          'e': 'Gum'
        },
        'answer': 'd'
      },
      {'question': 'The original Hersey\'s logo had...',
        'options': {
          'a': 'A baby in a cocoa bean',
          'b': 'Milton\'s Initials',
          'c': 'A Hershey Kiss Silhouette',
          'd': 'Chocolate chips forming an H'
        },
        'answer': 'a'
      },
      {'question': 'Bittersweet chocolate has a ______ cocoa percentage than semisweet chocolate.',
        'options': {
          'a': 'Higher',
          'b': 'Lower'
        },
        'answer': 'a'
      },
      {'question': 'Real white chocolate has a cacao percentage of around...',
        'options': {
          'a': '7%',
          'b': '22%',
          'c': '39%',
          'd': '64%'
        },
        'answer': 'b'
      },
      {'question': 'Most cocoa (70%) hails from...',
        'options': {
          'a': 'North America',
          'b': 'Central America',
          'c': 'South America',
          'd': 'West Africa',
          'e': 'Southern Africa'
        },
        'answer': 'd'
      },
      {'question': 'The most cocoa (40% of the world supply) is produced by...',
        'options': {
          'a': 'Ghana',
          'b': 'Brazil',
          'c': 'Cote d\'Ivoire',
          'd': 'Nigeria',
          'e': 'Venezuela'
        },
        'answer': 'c'
      },
      {'question': 'The __________ invented milk chocolate',
        'options': {
          'a': 'Americans',
          'b': 'Belgians',
          'c': 'Spanish',
          'd': 'Swiss'
        },
        'answer': 'd'
      }
    ]
}

// initialize/reset game state 
function initializeApp() {
  appState = resetAppState();
  // sets PHASE to initialize
  data = resetData();
}

// ===============
// FUNCTIONS/LOGIC
// ===============

$(document).ready(function() {
  // uses backstretch jquery plugin
  $('body').backstretch('assets/images/chocolate2.jpg');

  var gameplay = {

    beginGame: function() {
      //PHASE : initialize
      if(appState.phase !== 'initialize') {
        initializeApp();
      }
      appState.phase = 'firstQuestion';
      gameplay.startCountdown();
      browser.refreshDisplay();
    },

    selectNextQuestion: function() {
      //PHASE is prepareForNext, set to waitingForAnswer
      appState.phase = 'waitingForAnswer';
      appState.userAnswer = null;
      appState.currentQuestionObject = data[appState.questionIndex];
      appState.questionIndex++;
      gameplay.startCountdown();
      browser.refreshDisplay();
    },

    startCountdown: function() {
      //PHASE: waitingForAnswer or prepareForNext(or firstQuestion)
      // don't allow interval to be setup multiple times over itself 
      if(appState.interval === null) {
        if(appState.phase === 'firstQuestion'){
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
      if(appState.phase==='waitingForAnswer'){
        //if(appState.timeToAnswer > 0){
        if(appState.timeToAnswer > 0){
          appState.timeToAnswer--;
        } else {
          appState.phase = 'showResult';
          gameplay.stopCountdown();
        }
      } 
      else if(appState.phase==='prepareForNext' || appState.phase === 'firstQuestion'){
        if(appState.timeBeforeNextQuestion > 0){
          appState.timeBeforeNextQuestion--;
        } else {
          appState.phase = 'getQuestion';
          gameplay.stopCountdown(); // every start call needs a stop call to clear the interval so it doesn't double up
        }
      } 
    },

    stopCountdown: function() {
      //PHASE: showResult
      clearInterval(appState.interval);
      gameplay.resetCountdown();
      if(appState.phase === 'showResult') {
        gameplay.checkAnswer(appState.userAnswer);
      } 
      else if(appState.phase === 'getQuestion') {
        gameplay.selectNextQuestion();
      } 
    },

    resetCountdown: function() {
      appState.timeToAnswer = 30;
      appState.timeBeforeNextQuestion = 5; //more after 1st 
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
        appState.result = 'unanswered';
        appState.scoreCounters.unanswered++;
      }
      // if correct: 
      else if(appState.userAnswer === correctAnswerKey) {
        appState.result = 'correct';
        appState.scoreCounters.correct++;
      }
      // if incorrect
      else if (appState.userAnswer !== correctAnswerKey) {
        appState.result = 'incorrect';
        appState.scoreCounters.incorrect++;
      } 
      //show the result and correct answer if not selected
      browser.refreshDisplay();

      //wait some time and then continue
      if (appState.questionIndex < data.length) {
        appState.phase = 'prepareForNext';
        gameplay.startCountdown();
      } else {
        appState.phase = 'endGame';
        // slight pause
        setTimeout(function() {
          browser.refreshDisplay();
        }, 1000*3)
      }
    }

  };

// ================
// EVENT MANAGEMENT
// ================
  // click start - begins game (start timer, select question, show question, etc.)

  // user clicks answer - processes answer
  // use jquery event management so it applies to buttons created in the future
  $('.choice-items-section').on('click', '.choice-item',function(){
    if(appState.phase === 'waitingForAnswer'){
      //set phase to showResult
      appState.phase = 'showResult';
      var selectedKey = $(this).attr('data-key');
      appState.userAnswer = selectedKey;
      gameplay.stopCountdown();
    }
  });

  // click start over button - resets game
  $('.start-button').on('click', function() {
    if(appState.phase === 'initialize' || appState.phase === 'endGame'){
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
      $('.question-section').empty();
      var key = 'question';
      if(object.hasOwnProperty(key)){
        value = object[key];
        var newHeader = $('<h1>' + value + '</h1>');
        newHeader.attr('data-key', key);
        newHeader.addClass('question-text');
        $('.question-section').html(newHeader);
      }
    },

    renderChoiceItems: function(object) {
      $('.choice-items-section').empty();
      for(var i = 0; i < Object.keys(object.options).length; i++){
        var key = Object.keys(object.options)[i];
        if(object.options.hasOwnProperty(key)){
          var value = object.options[key];
          var newButton = $('<button class="btn btn-default">' + value + '</button>');
          newButton.attr('data-key',key);
          newButton.addClass('choice-item');
          $('.choice-items-section').append(newButton);
        }

      }
      // }
    },

    renderCountdown: function() {
      //refresh content each 1s interval
      $('.countdown-section').empty();
      if(appState.phase==='waitingForAnswer'){
        var time = appState.timeToAnswer;
        if(time >= 0){
          if(time < 10){time = '0' + time;}
          var newElement = $('<p>00:' + time + '</p>');
        }
      } else if(appState.phase === 'prepareForNext'){
        var time = appState.timeBeforeNextQuestion;
        if(time>0){
          var newElement = $('<p>Continue in ' + time + '</p>');
        }
      }
      $('.countdown-section').append(newElement);
    },

    displayFirstCountdown: function() {
      if (appState.phase === 'firstQuestion'){
        $('.countdown-section').empty();
        var time = appState.timeBeforeNextQuestion;
        if(time >= 0){
          if(time<10){time = '0' + time;}
          var instructionText = 'Let\'s get started! You\'ll have ' + appState.timeToAnswer + ' seconds to answer each question.';
          var newElement = $('<p>Ready? 00:' + time + '</p>');
        } 
        $('.instruction-section').html(instructionText);
        $('.countdown-section').append(newElement);
      }
    },

    displayResult: function() {
      var correctAnswerKey = appState.currentQuestionObject.answer
      var correctAnswerValue = appState.currentQuestionObject.options[correctAnswerKey];

      if (appState.result === 'unanswered') {
        var newText = 'Your time is up! The correct answer was: <span class=\'answer\'>' + correctAnswerValue + "</span>";

      }
      // if correct: 
      else if(appState.result === 'correct') {
        var newText = 'Great job, <span class=\'answer\'>' + correctAnswerValue + '</span> is correct!';
      }
      // if incorrect
      else if (appState.result === 'incorrect') {
        var newText = 'Nope, the correct answer is:  <span class=\'answer\'>' + correctAnswerValue + '</span>';
      }

      var newElement = $('<p>' + newText + '</p>');
      newElement.addClass('result-text');
      $('.result-section').append(newElement); 
    },

    updateScore: function() {
      $('.score-value').remove();
      for(var i = 0; i < Object.keys(appState.scoreCounters).length; i++){
        var key = Object.keys(appState.scoreCounters)[i];
        if(appState.scoreCounters.hasOwnProperty(key)){
          var value = appState.scoreCounters[key];
          var newElement = $('<p>' + key + ": " + value + '</p>');
          newElement.attr('data-key',key);
          newElement.addClass('score score-value ' + key);
          $('.'+key).html(newElement);
        }
      }
    },

    displayEndText: function() {
      var newText = 'Can you top that? Click \'new game\' to play again.';
      $('.instruction-section').html(newText);
    },

  // display whether correct or incorrect
    // display correct answer if incorrect
  // reset display for new game/game start

  //refresh display function to call all of these. --> call it in each function in the logic section
    refreshDisplay: function() {
      $('.countdown-section').empty();
      $('.choice-items-section').empty();
      $('.result-section').empty();

      if(appState.phase !== 'endGame' && appState.phase !== 'initialize'){
        $('.instruction-section').empty();
        $('.start-button').addClass('hidden');
        $('.score-section').removeClass('hidden');
      }

      if(appState.phase === 'initialize'){
        $('.score-section').addClass('hidden');
        $('.content-panel').addClass('hidden');
        $('.sidebar').addClass('col-md-12');
        $('.sidebar').removeClass('col-md-3');
      }
      else if (appState.phase === 'firstQuestion'){
        $('.sidebar').addClass('col-md-12');
        $('.sidebar').removeClass('col-md-3');
        $('.score-section').addClass('hidden');
        $('.time-panel').removeClass('hidden');
      }
      else if(appState.phase === 'getQuestion'){

      }
      else if(appState.phase === 'waitingForAnswer'){
        $('.sidebar').addClass('col-md-3');
        $('.sidebar').removeClass('col-md-12');
        $('.content-panel').removeClass('hidden');
        browser.renderQuestion(appState.currentQuestionObject);
        browser.renderChoiceItems(appState.currentQuestionObject);
      }
      else if(appState.phase === 'showResult'){
        browser.displayResult();
        browser.updateScore();
      }
      else if(appState.phase === 'prepareForNext'){
        $('.question-section').empty();
      }
      else if(appState.phase === 'endGame'){
        $('.question-section').empty();
        $('.start-button').removeClass('hidden');
        $('.content-panel').addClass('hidden');
        $('.time-panel').addClass('hidden');
        $('.sidebar').addClass('col-md-12');
        $('.sidebar').removeClass('col-md-3');
        browser.displayEndText();
      }
    }

  };

// =============
// INTIALIZE APP
// =============

  initializeApp();

});

// TODO: 
// pick question randomly
// get question that hasn't been asked yet by checking .asked value
// set countdown from 5 to a more reasonable number for each question
 // shorter countdown for between questions! use if else in start countdown based on appstate.phase