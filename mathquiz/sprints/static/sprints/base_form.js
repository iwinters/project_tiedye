var currentTab = 0; // Current tab is set to be the first tab (0)
var result = 100;
var score = 0;
name = "Player"
var successDiv = document.getElementById('success');
var finishLine = document.getElementById('finishLine');
_x_ = 0;
_y_ = 0;


// Press the visible button when user presses enter

window.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();

    
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
});

function checkAnswer(n) {
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
    checkMath();

}

function validateForm() {
  // This function deals with validation of the form fields
  var y, i, valid = true;
  y = document.getElementById("answer");
  // A loop that checks every input field in the current tab:
    if (y.value == "") {
      // add an "invalid" class to the field:
      y.className += "invalid";
      // and set the current valid status to false:
      valid = false;
    }
  return valid; // return the valid status
}

function checkMath() {
  //this function checks that the answer to the math question is correct
  y = document.getElementById("answer").value
  console.log(y)
  if (y == result) {
    console.log('Correctly Answered');
    document.getElementById('incorrect').classList.add('hidden');
    document.getElementById('checkButton').classList.add('hidden');
    document.getElementById('success').classList.remove('hidden');
    document.getElementById('nextButton').classList.remove('hidden');
    score +=10;
    console.log(score);
    pointsBarUpdate(10);
    if (score >= 100) {
      document.getElementById('regForm').classList.add('hidden');
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


function randomProblem() {

  //Generate 2 random numbers
  _x_ = Math.floor(Math.random() * 10);
  _y_ = Math.floor(Math.random() * 10);

  rule()

  //Plug 2 random numbers into the question_framework (a variable from the django model used for the equation the student sees)
  question = (question_framework.replace('_x_', _x_)).replace('_y_', _y_);
  
  //Plug 2 random numbers into the equation (a variable from the django model used for math-checking)
  result = eval((equation.replace('_x_', _x_)).replace('_y_', _y_));
  console.log(_x_)
  console.log(_y_)
  console.log(result )
  document.getElementById('question').innerHTML = question
  
}
function nextQuestion () {
  randomProblem();
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