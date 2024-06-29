const head = document.querySelector('head');
const body = document.querySelector('body');

const mochaCSSPath = "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.css";
const mochaCSSLinkEl = document.createElement('link');
mochaCSSLinkEl.rel = 'stylesheet';
mochaCSSLinkEl.href = mochaCSSPath;
head.appendChild(mochaCSSLinkEl);

const mochaStyleEl = document.createElement('style');
mochaStyleEl.innerHTML = `
  #mocha {
    font-family: sans-serif;
    position: fixed;
    overflow-y: auto;
    z-index: 1000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 48px 0 96px;
    background: white;
    color: black;
    display: none;
    margin: 0;
  }
  /* Add your custom styles here */
`;
head.appendChild(mochaStyleEl);

const mochaDiv = document.createElement('div');
mochaDiv.id = 'mocha';
body.appendChild(mochaDiv);

const testBtn = document.createElement('button');
testBtn.textContent = "Run Tests";
testBtn.id = 'mocha-test-btn';
testBtn.disabled = true;
body.appendChild(testBtn);

const scriptPaths = [
  "https://cdnjs.cloudflare.com/ajax/libs/mocha/8.3.2/mocha.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.4/chai.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/sinon.js/10.0.1/sinon.min.js",
];

const scriptTags = scriptPaths.map(path => {
  const scriptTag = document.createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.src = path;
  return scriptTag;
});

let loaded = 0;

function runTests() {
  mocha.setup("bdd");
  const expect = chai.expect;

  describe("Quiz Game", function () {
    let clock;

    const startQuiz = () =>
      document.getElementById('start-quiz').click();

    const chooseCorrectly = () => {
      const questionObj = questionsArr.find(qObj => getQuizHTML().includes(qObj.question));
      Array.from(document.querySelectorAll('#quiz button')).find(btn => btn.textContent === questionObj.answer).click();
    };

    const chooseIncorrectly = () => {
      const questionObj = questionsArr.find(qObj => getQuizHTML().includes(qObj.question));
      Array.from(document.querySelectorAll('#quiz button')).find(btn => btn.textContent !== questionObj.answer).click();
    };

    const getQuizHTML = () => document.getElementById('quiz').innerHTML;

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

    before(() => {
      clock = sinon.useFakeTimers();
      expect(questionsArr).to.exist;
      expect(Array.isArray(questionsArr)).to.be.true;
      expect(questionsArr.length >= 5).to.be.true;
      const runningTests = localStorage.getItem('test-run');
      localStorage.clear();
      if (runningTests) {
        localStorage.setItem('test-run', true);
      }
    });

    beforeEach(() => {
      sinon.stub(window, 'questionsArr').value(questionsArr);
    });

    after(() => {
      sinon.restore();
      testBtn.textContent = 'Close Tests';
      testBtn.disabled = false;
    });

    it('should show first question text, choices, and remaining time of 30 when start is clicked', () => {
      expect(getQuizHTML().includes(questionsArr[0].question)).to.be.false;
      startQuiz();
      expect(getQuizHTML().includes(questionsArr[0].question)).to.be.true;
      questionsArr[0].options.forEach(option => expect(getQuizHTML().includes(option)).to.be.true);
      expect(getQuizHTML().includes('30')).to.be.true;
    });

    it('should count down from 30 one second at a time', () => {
      clock.tick(1000);
      expect(getQuizHTML().includes('29')).to.be.true;
      clock.tick(1000);
      expect(getQuizHTML().includes('28')).to.be.true;
    });

    it('should show the next question and reset the timer when a correct option is chosen', () => {
      expect(getQuizHTML().includes('28')).to.be.true;
      chooseCorrectly();
      expect(getQuizHTML().includes('30')).to.be.true;
      expect(getQuizHTML().includes(questionsArr[0].question)).to.be.false;
      questionsArr[0].options.forEach(option => expect(getQuizHTML().includes(option)).to.be.false);
      expect(getQuizHTML().includes(questionsArr[1].question)).to.be.true;
      questionsArr[1].options.forEach(option => expect(getQuizHTML().includes(option)).to.be.true);
    });

    it('should show the next question and reset the timer when an incorrect option is chosen', () => {
      clock.tick(3000);
      expect(getQuizHTML().includes('27')).to.be.true;
      chooseIncorrectly();
      expect(getQuizHTML().includes('30')).to.be.true;
      expect(getQuizHTML().includes(questionsArr[1].question)).to.be.false;
      questionsArr[1].options.forEach(option => expect(getQuizHTML().includes(option)).to.be.false);
      expect(getQuizHTML().includes(questionsArr[2].question)).to.be.true;
      questionsArr[2].options.forEach(option => expect(getQuizHTML().includes(option)).to.be.true);
    });

    it('should end game when timer runs out on last question', () => {
      expect(getQuizHTML().includes('30')).to.be.true;
      clock.tick(1000);
      expect(getQuizHTML().includes('29')).to.be.true;
      clock.tick(30 * 1000);
      const currentHTML = getQuizHTML();
      questionsArr.forEach(({ question, options }) => {
        expect(currentHTML.includes(question)).to.be.false;
        options.forEach(option => expect(currentHTML.includes(option)).to.be.false);
      });
      expect(/\d+!%/.test(currentHTML)).to.be.false;
    });

    it('should show score when game is over and start quiz button', () => {
      expect(getQuizHTML().includes('33%')).to.be.true; 
      expect(document.getElementById('start-quiz')).to.exist;
    });

    it('should store score in localStorage under the key "previous-score"', () => {
      expect(localStorage.getItem('previous-score')).to.exist;
    });
  });

  mocha.run();
}

testBtn.onclick = function() {
  localStorage.setItem('test-run', true); 
  window.location.reload();
};

window.onload = function() {
  scriptTags.forEach(tag => {
    body.appendChild(tag);
    tag.onload = function() {
      loaded++;
      if (loaded === scriptTags.length) {
        testBtn.textContent = 'Run Tests';
        testBtn.disabled = false;
        testBtn.onclick = function() {
          runTests();
        };
      }
    };
  });
};
