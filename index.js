const questionsArr = [
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

let score = parseInt(localStorage.getItem('previous-score')) || 0;

function renderStartButtonOrScore() {
  const quizDiv = document.getElementById('quiz');
  if (score === 0) {
    quizDiv.innerHTML = '<button id="start-quiz">Start Quiz!</button>';
  } else {
    quizDiv.innerHTML = `<p>Previous Score: ${score}%</p><button id="start-quiz">Start Quiz!</button>`;
  }
}

function renderQuestion(questionObj, index) {
  const quizDiv = document.getElementById('quiz');
  quizDiv.innerHTML = `
    <p>${questionObj.question}</p>
    <div id="options">
      ${questionObj.options.map(option => `<button>${option}</button>`).join('')}
    </div>
    <p id="timer">30</p>
  `;

  const options = quizDiv.querySelectorAll('#options button');
  options.forEach(option => {
    option.addEventListener('click', () => {
      checkAnswer(option.textContent, questionObj.answer);
      clearInterval(timerInterval);
      setTimeout(nextQuestion, 1000);
    });
  });

  startTimer();
}

function startTimer() {
  let timeLeft = 30;
  const timerElement = document.getElementById('timer');
  timerElement.textContent = timeLeft;

  const timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      setTimeout(nextQuestion, 1000);
    }
  }, 1000);
}

function checkAnswer(selectedOption, correctAnswer) {
  if (selectedOption === correctAnswer) {
    score++;
  }
}

function nextQuestion() {
  const currentIndex = questionsArr.findIndex(q => !q.answered);
  if (currentIndex < questionsArr.length - 1) {
    renderQuestion(questionsArr[currentIndex + 1]);
    questionsArr[currentIndex].answered = true;
  } else {
    endQuiz();
  }
}

function endQuiz() {
  const quizDiv = document.getElementById('quiz');
  quizDiv.innerHTML = `
    <p>Final Score: ${Math.round((score / questionsArr.length) * 100)}%</p>
    <button id="start-quiz">Start Quiz!</button>
  `;
  localStorage.setItem('previous-score', score);
  score = 0;
}

document.addEventListener('DOMContentLoaded', renderStartButtonOrScore);

document.getElementById('quiz').addEventListener('click', function(event) {
  if (event.target.id === 'start-quiz') {
    score = 0;
    localStorage.removeItem('previous-score');
    renderQuestion(questionsArr[0]);
  }
});
