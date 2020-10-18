var currentTab = 0; // Current tab is set to be the first tab (0)
var result = 100;
var score = 0;
name = "Player"
var successDiv = document.getElementById('success');
var finishLine = document.getElementById('finishLine');
_x_ = 0;
_y_ = 0;
_z_ = 0;


// Press the visible button when user presses enter

window.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();

    if (type.includes('lesson')) {
        // Trigger the button element with a click
        if (successDiv.classList.contains('hidden')) {
          if (finishLine.classList.contains('hidden')) {
              document.getElementById("checkLessonMath").click();
          }
          else {
              document.getElementById("finishLineButton").click();
          }    
      }
      else {
          document.getElementById("nextButtonLesson").click();
      }

    }
    else {

            // Trigger the button element with a click
            if (successDiv.classList.contains('hidden')) {
              if (finishLine.classList.contains('hidden')) {
                  document.getElementById("checkButton").click();
              }
              else {
                  document.getElementById("finishLineButton").click();
              }    
          }
          else {
              document.getElementById("nextButton").click();
          }

    }


}
});


function sprintFeeder () {
  if (type != 'None') {
    if (type.includes('lesson')) {
      lesson();


    }
  }
  else {
    randomProblem();
    showProblemRegForm();
  }
}


function checkAnswer(n) {
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
    checkMath();

}

function validateForm() {
  // This function deals with validation of the form fields
  var answer, i, valid = true;
  answer = document.getElementById("answer");
  // A loop that checks every input field in the current tab:
    if (answer.value == "") {
      // add an "invalid" class to the field:
      answer.className += "invalid";
      // and set the current valid status to false:
      valid = false;
    }
  return valid; // return the valid status
}

function checkMath() {
  //this function checks that the answer to the math question is correct
  answer = document.getElementById("answer").value
  if (answer == result) {
    document.getElementById('incorrect').classList.add('hidden');
    document.getElementById('checkButton').classList.add('hidden');
    document.getElementById('success').classList.remove('hidden');
    document.getElementById('nextButton').classList.remove('hidden');
    score +=10;
    pointsBarUpdate(10);
    if (score >= 100) {
      document.getElementById('regForm').classList.add('hidden');
      document.getElementById('success').classList.add('hidden');
      document.getElementById('pointsUpdate').value += 25;
      document.getElementById('finishLine').classList.remove('hidden');
;

      
    }

  }
  else {
    document.getElementById('incorrect').classList.remove('hidden');
    document.getElementById('answer').value = "";
    document.getElementById('answer').focus();



  }

}


function randomProblem() {

  //Generate 2 random numbers
  _x_ = Math.floor(Math.random() * 10);
  _y_ = Math.floor(Math.random() * 10);
  _z_ = Math.floor(Math.random() * 10);


  rule()

  //Plug 2 random numbers into the question_framework (a variable from the django model used for the equation the student sees). /*/g format turns replace into replace all
  question = (question_framework.replace(/_x_/g, _x_)).replace(/_y_/g, _y_).replace(/_z_/g, _z_);
  
  //Plug 2 random numbers into the equation (a variable from the django model used for math-checking). /*/g format turns replace into replace all
  result = eval(((equation.replace(/_x_/g, _x_)).replace(/_y_/g, _y_)).replace(/_z_/g, _z_));
  console.log(equation);

  console.log(_x_);
  console.log(_y_);
  console.log(_z_);
  console.log(result );
  
}

function showProblemRegForm () {
  document.getElementById('question').innerHTML = question;
}

function showProblemLessonCard () {

  document.getElementById('lessonCardText').innerHTML = question;

}

function nextQuestion () {
  randomProblem();
  showProblemRegForm();
  document.getElementById('answer').value = "";
  document.getElementById('answer').focus();

  document.getElementById('success').classList.add('hidden');
  document.getElementById('incorrect').classList.add('hidden');
  document.getElementById('checkButton').classList.remove('hidden');
  document.getElementById('nextButton').classList.add('hidden');



}

function pointsBarUpdate(changeInt) {
  document.getElementById('pointsBar').style.width = score + '%'
}

//enforces any rules that must be applied to a specific sprint
function rule(){
  if (rules) {
    rulesList = rules.split(',')
    if (rulesList.includes('xGreaterThanY')) {
      xGreaterThanY()
    }

  }
}

//rules

function xGreaterThanY () {
  while (_y_ > _x_) {

    _x_ = Math.floor(Math.random() * 10);
    _y_ = Math.floor(Math.random() * 10);


  }
}

function lesson () {
  document.getElementById('regForm').classList.add('hidden');
  document.getElementById('lessonCard').classList.remove('hidden');

  equations = equation.split(',')
  counter = 1
  input = 1
  finalInputId = "not assigned"
  mainEquation = "not assigned"



  for (equation in equations) {
    placeholder = "_equation" + counter + "_"
    if (equations[equation].includes('?')) {
      question_framework = question_framework.replace(placeholder, '<br><div class = "lessonCardEquation">' + equations[equation] + '</div><br>');

      //separating the important bit of the overarching question, so we can use it for evaluation of correctness
      mainEquationFull = equations[equation]
      mainEquation = (mainEquationFull).substr(0, (mainEquationFull).indexOf('='));
      console.log(mainEquation)
    }
    else {
      question_framework = question_framework.replace(placeholder, '<br><div class = "lessonCardEquation">' + equations[equation] + ' = <input id="lessonInput' + input + '" class="lessonInput" oninput ="useVariableA()"></input>' + '</div><br>');
      finalInputId = "lessonInput" + input
      input +=1
      console.log(finalInputId)

    }
    counter +=1
  }

  randomProblemLesson()
  
  showProblemLessonCard();

  //  TO DO : gotta check that answer == result here.

}


function useVariableA () {
  var x = document.getElementById("lessonInput1").value;
  document.getElementById("variableA").value = x;
}

function checkLessonMath() {
  //this function checks that the answer to the math question is correct
  answer = document.getElementById(finalInputId).value
  if (answer == result) {
    document.getElementById('incorrect').classList.add('hidden');
    document.getElementById('checkLessonMath').classList.add('hidden');
    document.getElementById('success').classList.remove('hidden');
    document.getElementById('nextButtonLesson').classList.remove('hidden');
    score +=10;
    pointsBarLessonUpdate();
    if (score >= 100) {
      document.getElementById('lessonCard').classList.add('hidden');
      document.getElementById('success').classList.add('hidden');

      document.getElementById('finishLine').classList.remove('hidden')
      
    }

  }
  else {
    document.getElementById('incorrect').classList.remove('hidden');
    document.getElementById('answer').value = "";
    document.getElementById('answer').focus();



  }

}

function pointsBarLessonUpdate(changeInt) {
  document.getElementById('pointsBarLesson').style.width = score + '%'
}
function nextQuestionLesson () {
  randomProblemLesson();
  showProblemLessonCard();

  document.getElementById(finalInputId).value = "";
  document.getElementById(finalInputId).focus();

  document.getElementById('success').classList.add('hidden');
  document.getElementById('incorrect').classList.add('hidden');
  document.getElementById('checkLessonMath').classList.remove('hidden');
  document.getElementById('nextButtonLesson').classList.add('hidden');



}

function randomProblemLesson () {
  _x_ = Math.floor(Math.random() * 10);
  _y_ = Math.floor(Math.random() * 10);
  _z_ = Math.floor(Math.random() * 10);


  rule()

  //Plug 2 random numbers into the question_framework (a variable from the django model used for the equation the student sees). /*/g format turns replace into replace all
  question = question_framework.replace(/_x_/g, _x_).replace(/_y_/g, _y_).replace(/_z_/g, _z_).replace(/_a_/g, '<input id="variableA" class="lessonInput"></input>');
  
  //Plug 2 random numbers into the equation (a variable from the django model used for math-checking). /*/g format turns replace into replace all
  result = eval((((mainEquation.replace(/_x_/g, _x_)).replace(/_y_/g, _y_)).replace(/_z_/g, _z_).replace(/_a_/g, 'donkeymonkey')));


  console.log(_x_);
  console.log(_y_);
  console.log(_z_);
  console.log(result );
  
}



//Tree page

//Student select drop down
function selectStudentDropDown () {
  studentMenu = document.getElementById('studentMenu');
  studentMenu.classList.remove('hidden');
  document.addEventListener(
    'click',
    function () {
      studentMenu.classList.add('chunkkkkle');
    }
  )
}