

var questionsArr = [
  {
    question: 'Who was the first person to walk on the moon?',
    answer: 'Neil Armstrong',
    options: [
      'Andrew Walker',
      'Michael Thompson',
      'Neil Armstrong',
      'Daniel Lewis',
    ]
  },
  {
    question: 'In what year did we first land on the moon?',
    answer: '1969',
    options: [
      '2003',
      '1975',
      '1996',
      '1969',
    ]
  },
  {
    question: 'Which planet in our solar system has the most moons?',
    answer: 'Jupiter',
    options: [
      'Neptune',
      'Saturn',
      'Jupiter',
      'Mars',
    ]
  },
  {
    question: 'What was the name of the first space shuttle to go into space?',
    answer: 'Columbia',
    options: [
      'Columbia',
      'Olympus',
      'Sputnik',
      'Apollo',
    ]
  },
  {
    question: 'What is the name of our galaxy?',
    answer: 'The Milky Way',
    options: [
      'The Pinwheel Galaxy',
      'The Milky Way',
      'Andromeda Galaxy',
      'Whirlpool Galaxy',
    ]
  }
];


var currentQuestionIndex = 0;
var score = 0;
var timer;
var timeLeft = 30;


var quizContainer = document.getElementById('quiz');


function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
  startTimer();
}


function showQuestion() {
  var questionObj = questionsArr[currentQuestionIndex];
  quizContainer.innerHTML = '';

  var questionElement = document.createElement('p');
  questionElement.textContent = questionObj.question;
  quizContainer.appendChild(questionElement);

  var optionsContainer = document.createElement('div');
  questionObj.options.forEach(function(option) {
    var button = document.createElement('button');
    button.textContent = option;
    button.onclick = checkAnswer;
    optionsContainer.appendChild(button);
  });
  quizContainer.appendChild(optionsContainer);

  var timerElement = document.createElement('p');
  timerElement.id = 'timer';
  timerElement.textContent = timeLeft;
  quizContainer.appendChild(timerElement);
}


function checkAnswer(event) {
  var selectedAnswer = event.target.textContent;
  var correctAnswer = questionsArr[currentQuestionIndex].answer;
  
  if (selectedAnswer === correctAnswer) {
    score++;
  }

  nextQuestion();
}


function nextQuestion() {
  clearInterval(timer);
  currentQuestionIndex++;
  
  if (currentQuestionIndex < questionsArr.length) {
    timeLeft = 30;
    showQuestion();
    startTimer();
  } else {
    endQuiz();
  }
}


function startTimer() {
  timer = setInterval(function() {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    
    if (timeLeft === 0) {
      nextQuestion();
    }
  }, 1000);
}


function endQuiz() {
  clearInterval(timer);
  var scorePercentage = Math.round((score / questionsArr.length) * 100);
  localStorage.setItem('previous-score', scorePercentage);

  quizContainer.innerHTML = `
    <p>Previous Score: ${scorePercentage}%</p>
    <button id="start-quiz">Start Quiz!</button>
  `;

  document.getElementById('start-quiz').addEventListener('click', startQuiz);
}


function initQuiz() {
  var previousScore = localStorage.getItem('previous-score');
  
  if (previousScore) {
    quizContainer.innerHTML = `
      <p>Previous Score: ${previousScore}%</p>
      <button id="start-quiz">Start Quiz!</button>
    `;
  } else {
    quizContainer.innerHTML = `
      <button id="start-quiz">Start Quiz!</button>
    `;
  }

  document.getElementById('start-quiz').addEventListener('click', startQuiz);
}


window.onload = initQuiz;
