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
const btnSend = document.querySelector('.btn__send');
let index = 0;
// helper function for getting randon number;
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
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

const questionsApi = async function () {
  const promise = await fetch(
    'https://opentdb.com/api.php?amount=10&category=31&difficulty=easy&type=multiple'
  );
  const result = await promise.json();
  const questionsArray = result.results;
  console.log(questionsArray);
  //creating answers array
  let answersArr = [
    questionsArray[index].correct_answer,
    questionsArray[index].incorrect_answers[0],
    questionsArray[index].incorrect_answers[1],
    questionsArray[index].incorrect_answers[2],
  ];
  answersArr = shuffleArray(answersArr);
  // getting question number
  displayQuestionNum.innerHTML = `Question ${index + 1}/10`;

  // getting question  name
  question.innerHTML = `${questionsArray[index].question}`;

  //getting question options
  answer1.innerHTML = answersArr[0];
  answer2.innerHTML = answersArr[1];
  answer3.innerHTML = answersArr[2];
  answer4.innerHTML = answersArr[3];

  console.log(allAnswers);
  allAnswers.forEach((el) => {
    el.addEventListener('click', function (e) {
      if (
        el.lastElementChild.textContent === questionsArray[index].correct_answer
      ) {
        el.classList.add('correctAnswer');
      }
      if (
        el.lastElementChild.textContent !== questionsArray[index].correct_answer
      ) {
        el.classList.add('wrongAnswer');
      }
      console.log(el.lastElementChild.textContent);
    });
  });

  btnSend.addEventListener('click', function () {
    index = index++;
  });
};

questionsApi();
