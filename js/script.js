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

//starting timer
timer = setInterval(function () {
  displayTime.innerHTML =
    `⏰ ` +
    `${parseInt(sec / 60, 10)}`.padStart(2, 0) +
    `:` +
    `${++sec % 60}`.padStart(2, 0);
}, 1000);
// clearing timer
const clearTimer = function () {
  clearInterval(timer);
  sec = 0;
};
// helper function for getting randon number;
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

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
  index = correctAnswersNum = wrongAnswersNum = 0;
  questionsApi();
  clearTimer();
  clearClassNames();
};

// implementing array shuffling
const shuffleArray = function (arr) {
  const copyArr = [...arr];
  let shuffledArr = [];
  while (copyArr.length - 1 > 0) {
    let randNum = randomInt(0, copyArr.length - 1);
    shuffledArr.push(copyArr[randNum]);
    copyArr.splice(randNum, 1);
  }
  shuffledArr.push(copyArr[0]);
  return shuffledArr;
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
  answersArr = shuffleArray(answersArr);
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

// main funtion
const questionsApi = async function () {
  const promise = await fetch(
    'https://opentdb.com/api.php?amount=10&category=31&difficulty=easy&type=multiple'
  );
  const result = await promise.json();
  const questionsArray = result.results;

  //loading questions
  loadQuestions(index, questionsArray);

  console.log(allAnswers);
  allAnswers.forEach((el) => {
    el.addEventListener('click', function (e) {
      if (
        el.lastElementChild.textContent === questionsArray[index].correct_answer
      ) {
        el.classList.add('correctAnswer');
        ++correctAnswersNum;
        displayCorrect.innerHTML = `✔ ${correctAnswersNum} correct`;
        // game win func
      }

      if (
        el.lastElementChild.textContent !== questionsArray[index].correct_answer
      ) {
        el.classList.add('wrongAnswer');
        ++wrongAnswersNum;
        displayWrong.innerHTML = `❌ ${wrongAnswersNum} wrong`;
        // find the right answer and show it
        allAnswers.forEach((el) => {
          if (
            el.lastElementChild.textContent ===
            questionsArray[index].correct_answer
          )
            el.classList.add('correctAnswer');
        });
        // game win func
      }
      console.log(el.lastElementChild.textContent);
    });
  });

  btnNext.addEventListener('click', function () {
    clearClassNames();
    index = index + 1;
    console.log(index);
    loadQuestions(index, questionsArray);
  });
};

questionsApi();
