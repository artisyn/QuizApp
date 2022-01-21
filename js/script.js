'use strict';
const displayCorrect = document.querySelector('.correct');
const displayWrong = document.querySelector('.wrong');
const displayTime = document.querySelector('.time');
const displayQuestionNum = document.querySelector('.questionNum');
const question = document.querySelector('.question');
const answer1 = document.querySelector('.answer1');
const answer2 = document.querySelector('.answer2');
const answer3 = document.querySelector('.answer3');
const answer4 = document.querySelector('.answer4');
const displayGameRes = document.querySelector('.gameResults');
const allAnswers = document.querySelectorAll('.answer');
const btnReplay = document.querySelector('.btn__replay');
const btnNext = document.querySelector('.btn__next');
let index = 0;
let correctAnswersNum = 0;
let wrongAnswersNum = 0;
//timer elements
let timer;
let sec = 0;
// functions
const startTimer = () => {
  timer = setInterval(function () {
    displayTime.innerHTML =
      `⏰ ` +
      `${parseInt(sec / 60, 10)}`.padStart(2, 0) +
      `:` +
      `${++sec % 60}`.padStart(2, 0);
    return timer;
  }, 1000);
};

//starting timer
startTimer();
// clearing timer
const clearTimer = function () {
  clearInterval(timer);
  sec = 0;
  displayTime.innerHTML = '⏰ 00:00';
};
// helper function for getting randon number;
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// decode special symbols in html (for better comparing whith correct answer)

const htmlDecode = function (input) {
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
};

//helper function to disable clicking
const dispableClicking = function () {
  allAnswers.forEach((el) => (el.style.pointerEvents = 'none'));
};
//helper function to enable clicking
const enableClicking = function () {
  allAnswers.forEach((el) => (el.style.pointerEvents = 'auto'));
};

//function for clearing unnecessary classlists
const clearClassNames = function () {
  allAnswers.forEach((el) => {
    if (el.classList.contains('correctAnswer'))
      el.classList.remove('correctAnswer');

    if (el.classList.contains('wrongAnswer'))
      el.classList.remove('wrongAnswer');
  });
};

const clearAll = function () {
  displayGameRes.innerHTML = '';
  displayGameRes.classList.add('displayNone');
  index = correctAnswersNum = wrongAnswersNum = 0;
  displayCorrect.innerHTML = `✔ ${correctAnswersNum} correct`;
  displayWrong.innerHTML = `❌ ${wrongAnswersNum} wrong`;
  questionsApi();
  clearTimer();
  clearClassNames();
  console.log(correctAnswersNum, wrongAnswersNum, index);
};

// implementing array shuffling
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

//loading questions for user
const loadQuestions = function (i, questionsArray) {
  let answersArr = [
    questionsArray[i].correct_answer,
    questionsArray[i].incorrect_answers[0],
    questionsArray[i].incorrect_answers[1],
    questionsArray[i].incorrect_answers[2],
  ];
  // shuffling the order of questions
  answersArr = shuffleArray(answersArr); /////////////////////////////////////////////////
  // getting question number
  displayQuestionNum.innerHTML = `Question ${i + 1}/10`;
  // getting question  name
  question.innerHTML = `${questionsArray[index].question}`;
  //getting question options
  answer1.innerHTML = answersArr[0];
  answer2.innerHTML = answersArr[1];
  answer3.innerHTML = answersArr[2];
  answer4.innerHTML = answersArr[3];
};

// check for game end
const gameEnd = function () {
  if (index === 9) {
    btnNext.disabled = true;
    btnNext.classList.remove('hoverGlow');
    btnNext.innerHTML = '';
    dispableClicking();
    const finalScore = `Thank you for playing, your score is: ${correctAnswersNum}/10 🏆!`;
    displayGameRes.innerHTML = finalScore;
    setTimeout(function () {
      displayGameRes.classList.remove('displayNone');
    }, 2000);
  }
};

// main funtion
const questionsApi = async function () {
  try {
    const promise = await fetch(
      'https://opentdb.com/api.php?amount=10&category=31&difficulty=easy&type=multiple'
    );
    const result = await promise.json();
    const questionsArray = result.results;
    console.log(questionsArray);

    //loading questions
    loadQuestions(index, questionsArray);

    allAnswers.forEach((el) => {
      el.addEventListener('click', function (e) {
        if (
          htmlDecode(el.lastElementChild.innerHTML) ===
          htmlDecode(questionsArray[index].correct_answer)
        ) {
          dispableClicking();
          el.classList.add('correctAnswer');
          correctAnswersNum = correctAnswersNum + 1;
          displayCorrect.innerHTML = `✔ ${correctAnswersNum} correct`;

          // game win func
          gameEnd();
        }

        if (
          htmlDecode(el.lastElementChild.innerHTML) !==
          htmlDecode(questionsArray[index].correct_answer)
        ) {
          dispableClicking();
          el.classList.add('wrongAnswer');
          wrongAnswersNum = wrongAnswersNum + 1;
          displayWrong.innerHTML = `❌ ${wrongAnswersNum} wrong`;
          // find the right answer and show it
          allAnswers.forEach((el) => {
            if (
              htmlDecode(el.lastElementChild.innerHTML) ===
              htmlDecode(questionsArray[index].correct_answer)
            )
              el.classList.add('correctAnswer');
          });

          // game win func
          gameEnd();
        }
      });
    });

    btnNext.addEventListener('click', function () {
      clearClassNames();
      index = index + 1;
      loadQuestions(index, questionsArray);
      enableClicking();
    });
  } catch (err) {
    console.log(err);
  }
};

btnReplay.addEventListener('click', function () {
  location.reload();
  // doesn't work(stacks async functions)
  // clearAll();
  // btnNext.disabled = false;
  // enableClicking();
  // startTimer();
  // questionsApi();
});

questionsApi();
