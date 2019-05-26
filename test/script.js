const electron = require('electron');
const {ipcRenderer} = electron;


const quizContainer = document.getElementById('quiz');

const answers = document.getElementById('results');
const button = document.getElementById('botonsito');

const previousButton = document.querySelector('.nuevaFlechaIzquierda');
const nextButton = document.querySelector('.nuevaFlechaDerecha');

const resultadoFinal = document.getElementById('borrarDiv');
const mostrarResultado = document.querySelector('.contenedorTest');

const fs = require('fs');




/* Array of objects that containes the the flags, questions and answers */

const myQuestions = [
  {
    flag: "nepal.png",
    question: "Elija la respuesta correcta",
    answers: {
      a: "Mongolia",
      b: "Nepal",
      c: "Birmania"
    },
    correctAnswer: "b"
  },
  {
    flag: "finland.png",
    question: "Elija la respuesta correcta",
    answers: {
      a: "Suecia",
      b: "Noruega",
      c: "Finlandia"
    },
    correctAnswer: "c"
  },
  {
    flag: "russia.svg",
    question: "Select the correct answer",
    answers: {
      a: "Rusia",
      b: "Estonia",
      c: "Alemania"
    },
    correctAnswer: "a"
  },
  {
    flag: "southkorea.jpg",
    question: "Elija la respuesta correcta",
    answers: {
      a: "Laos",
      b: "Corea del Norte",
      c: "Corea del Sur"
    },
    correctAnswer: "c"
  },
  {
    flag: "vietnam.png",
    question: "Elija la respuesta correcta",
    answers: {
      a: "Vietnam",
      b: "Cambodia",
      c: "China"
    },
    correctAnswer: "a"
  },
  {
    flag: "croatia.png",
    question: "Elija la respuesta correcta",
    answers: {
      a: "Serbia",
      b: "Croacia",
      c: "Eslovaquia"
    },
    correctAnswer: "b"
  },
  {
    flag: "venezuela.png",
    question: "Elija la respuesta correcta",
    answers: {
      a: "Perú",
      b: "Ecuador",
      c: "Venezuela"
    },
    correctAnswer: "c"
  },
  {
    flag: "turkey.png",
    question: "Elija la respuesta correcta",
    answers: {
      a: "Qatar",
      b: "Turquía",
      c: "Siria"
    },
    correctAnswer: "b"
  },
  {
    flag: "israel.jpg",
    question: "Elija la respuesta correcta",
    answers: {
      a: "Israel",
      b: "Siria",
      c: "Palestina"
    },
    correctAnswer: "a"
  },
  {
    flag: "saudiArabia.png",
    question: "Elija la respuesta correcta",
    answers: {
      a: "Arabia Saudí",
      b: "Egipto",
      c: "Afganistán"
    },
    correctAnswer: "a"
  }
];

/* Function that will create the test and put it on a html.*/

function buildQuiz(){

  //Declaramos una variable output
    const output = [];

//Este forEach nos permitirá recorrer el array de objetos en el que tenemos guardado el TEST

    myQuestions.forEach((currentQuestion, questionNumber) => {

      //We declare a variable that will contain all the answers
      const answers = [];

      //The for in loop allows as to run and have access to an object data. In this case we need to combine it with the for each. The foreach lets us have access to the different
      //elements of the array of objects, and thanks to the for in loop we can have access to the elemens of the answers object

      for(letter in currentQuestion.answers){
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}" style="opacity:1; position: relative; ">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      /* We push all the data to the output array that we previously declared. */

      output.push(

      `<div class='slide'>
          <div class='flags'> <img src="${currentQuestion.flag}" height="300" width="400">  </div>
          <div class='question'> ${currentQuestion.question} </div>
        <div class='answers'>${answers.join('')} </div>
      </div>`
      );

    }
  );

  //We use the constant that holds the div where we want to show all the test and put it using the innerHTML method.

  quizContainer.innerHTML = output.join('');
}


//Function that will show the results inserting them into the innerhtml.


function showResults(){

  /*We get with this querySelectorAll all the elements of the div with the class answers.*/
  const answerContainers = document.querySelectorAll('.answers');

  //Variable to hold the score
  let score = 0;

//A loop that we'll serve us to get the user's inputs from the answers.
  myQuestions.forEach((currentQuestion, questionNumber) => {


    /*These 3 variables will serve us to collect whether an input has been checked or not and compare it to the correct answers


    */
    const answerContainer = answerContainers[questionNumber];
    const selector = 'input[name=question'+questionNumber+']:checked';
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    //The conditional that will add points to the score in case how answer matches the right question
    if(userAnswer === currentQuestion.correctAnswer){
      score++;


      answerContainers[questionNumber].classList.add('respuestaCorrecta');
    }

    else {
      answerContainers[questionNumber].classList.add('respuestaIncorrecta');
    }
  });

  resultadoFinal.style.display = 'none'; //This will delete the div that shows the test
  button.style.display ='none'; //this will delete the button that sends the text
  timer.style.display = 'none'; //This will delete the timer


  //Variable and conditional that will print the results
  let notas;
  if(score < 5){notas = ' Has suspendido. Vuelva a intentarlo de nuevo después de estudiar un poco más.'} else if(score >= 5) { notas = 'Enhorabuena, has aprobado'};


  //Logic that will show the results
  const nuevoResultado = document.createElement('DIV');
  nuevoResultado.classList.add('resultadoConEstilo');
  nuevoResultado.innerHTML = score + ' de un total de ' + myQuestions.length + '. ' + notas;
  mostrarResultado.appendChild(nuevoResultado);


  //Conditionals that will print into the innerHTML the time that it took the test
  if(minutos === 0){
    const contenedorMinutos = document.createElement('SPAN');
    contenedorMinutos.classList.add('losMinutos');
    contenedorMinutos.innerHTML = ' Has tardado ' + segundos + ' segundos.';
    nuevoResultado.appendChild(contenedorMinutos);
  }
  else if (minutos === 1){
    const contenedorMinutos = document.createElement('SPAN');
    contenedorMinutos.classList.add('losMinutos');
    contenedorMinutos.innerHTML = ' Has tardadado ' + minutos + ' minuto y ' + segundos + ' segundos.';
    nuevoResultado.appendChild(contenedorMinutos);
  } else if(minutos > 1) {
    const contenedorMinutos = document.createElement('SPAN');
    contenedorMinutos.classList.add('losMinutos');
    contenedorMinutos.innerHTML = ' Has tardadado ' + minutos + ' minutos y ' + segundos + ' segundos.';
    nuevoResultado.appendChild(contenedorMinutos);
  }


  //What does this function is stopping the interval called reloj. So what will happen is that the timer starts and once we push the button, the function showResult will start and the interval reloj stops once it gets to this line
  clearInterval(reloj);


  //Creates a file with the result
  let date = new Date();
  let dateYear = date.getFullYear();
  let dateDay = date.getDate();
  let dateMonth = date.getMonth();
  let dateHour = date.getHours();
  let dateMinute = date.getMinutes();
  let fullTime = `Fecha: ${dateDay}/${dateMonth}/${dateYear} ${dateHour}:${dateMinute}`;

  const path = './testing.txt';

  if(fs.existsSync(path)){
    fs.appendFile('testing2.txt', ` \n\n ${score} de un total de ${myQuestions.length}. ${fullTime} \n`, (err) => {
      if(err) throw err;
      console.log("The file was saved!");
    });
  } else {
    fs.writeFile('testing2.txt', `${score} de un total de ${myQuestions.length}. ${fullTime}`, function(err){
      if(err){
        return console.log(err);
      }
      console.log("The file was saved!");
    })
  }
}

buildQuiz();

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(n){
  slides[currentSlide].classList.remove('active-slide');
  slides[n].classList.add('active-slide');
  currentSlide = n;

  if(currentSlide === 0){
    previousButton.style.display ='none';
  } else {
    previousButton.style.display ='inline-block';
  }

  if(currentSlide===slides.length-1){
    nextButton.style.display = 'none';
    button.style.display = 'inline-block';
  } else {
    nextButton.style.display = 'inline-block';
    button.style.display = 'none';
  }

}

showSlide(0);


function showNextSlide(){
  showSlide(currentSlide + 1);
}


function showPreviousSlide(){
    showSlide(currentSlide - 1);
}

previousButton.addEventListener('click', showPreviousSlide);
nextButton.addEventListener('click', showNextSlide);


/* TIMER */
const timer = document.querySelector('.timer');
let segundos = 0;
let minutos = 0;
let horas = 0;

const reloj = setInterval(function(){
  segundos++;
  if(segundos > 59){
    segundos = 0;
    minutos+=1;
    if(minutos > 59){
      minutos = 0;
      horas++;
    }
  }
    timer.textContent = horas + 'h : ' + minutos + 'min : ' +segundos + 'seg';

}, 1000);
