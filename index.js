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

document.addEventListener('DOMContentLoaded', () => {
  const quizDiv = document.getElementById('quiz');

  function initializeGame() {
    quizDiv.innerHTML = '';

    const previousScore = localStorage.getItem('previous-score');
    if (previousScore) {
      const scoreParagraph = document.createElement('p');
      scoreParagraph.textContent = `Previous Score: ${previousScore}%`;
      quizDiv.appendChild(scoreParagraph);
    }

    const startButton = document.createElement('button');
    startButton.id = 'start-quiz';
    startButton.textContent = 'Start Quiz!';
    startButton.addEventListener('click', startQuiz);
    quizDiv.appendChild(startButton);
  }

  initializeGame();
});
function startQuiz() {
  let currentQuestionIndex = 0;
  let score = 0;
  const totalQuestions = questionsArr.length;
  const quizDiv = document.getElementById('quiz');

  function displayQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
      endQuiz();
      return;
    }

    quizDiv.innerHTML = '';

    const questionObj = questionsArr[currentQuestionIndex];
    const questionParagraph = document.createElement('p');
    questionParagraph.textContent = questionObj.question;
    quizDiv.appendChild(questionParagraph);

    const optionsDiv = document.createElement('div');
    questionObj.options.forEach(option => {
      const optionButton = document.createElement('button');
      optionButton.textContent = option;
      optionButton.addEventListener('click', () => handleAnswer(option));
      optionsDiv.appendChild(optionButton);
    });
    quizDiv.appendChild(optionsDiv);

    const timerParagraph = document.createElement('p');
    timerParagraph.id = 'timer';
    quizDiv.appendChild(timerParagraph);

    startTimer();
  }

  function startTimer() {
    let timeRemaining = 30;
    const timerParagraph = document.getElementById('timer');
    timerParagraph.textContent = timeRemaining;

    const intervalId = setInterval(() => {
      timeRemaining--;
      timerParagraph.textContent = timeRemaining;
      if (timeRemaining <= 0) {
        clearInterval(intervalId);
        handleAnswer(null);
      }
    }, 1000);
  }

  function handleAnswer(selectedOption) {
    const currentQuestion = questionsArr[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      score++;
    }
    currentQuestionIndex++;
    displayQuestion();
  }

  function endQuiz() {
    const percentageScore = Math.round((score / totalQuestions) * 100);
    localStorage.setItem('previous-score', percentageScore);

    quizDiv.innerHTML = '';
    const scoreParagraph = document.createElement('p');
    scoreParagraph.textContent = `Score: ${percentageScore}%`;
    quizDiv.appendChild(scoreParagraph);

    const startButton = document.createElement('button');
    startButton.id = 'start-quiz';
    startButton.textContent = 'Start Quiz!';
    startButton.addEventListener('click', startQuiz);
    quizDiv.appendChild(startButton);
  }

  displayQuestion();
}

