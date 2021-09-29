var circle;
var detectShake = false;
var initX = null;
var initY = null;
var currentans = 0;
var listOpen = false;

const answerList = [
  ['TIME FOR \n\u{1F377}', 18],
  ['I THINK KARMA', 20],
  ['Ouch\u2026', 25],
  ['I\u0027LL DO THIS WHEN I RETIRE', 12],
  ['SAD TRUTH OF LIFE ', 20],
  ['BE CALM, BRAVE, WE OWN THIS.', 6],
  ['ESD\nGOTCHA', 19],
  ['Let me tell you a funny story\u2026', 13],
  ['GIVEN CREDIT WHERE IT\u0027S DUE', 12],
  ['ONE SOLID PUNCH!', 16],
  ['LET\u0027S GO CHECK OUT GEBIZ', 10],
  ['I always have trust in you', 16],
  ['Cheers\n\u{1F37A}', 23],
  ['Thank you for your\npatience', 10],
  ['\u{1F60A}\u{1F44D}', 28],
  ['Shout if you need anything =)', 9],
  [' * INSERT RANDOM ARTICLE * ', 6],
  ['PARK THIS FOR LATER.', 16],
  ['ADDED SLIDES, TREAT AS RANDOM SKETCH!', 0],
  ['GRAB A DRINK, BRB 3MINS.', 13]
]


//%% Motion controls %%

function deviceOrientationListener(event) {
  let skewX; 
  let skewY; 

  if (!initY) {
    initY = event.beta
  }
  if (!initX) {
    initX = event.gamma
  }

  var offsetY = initY || 0;
  var offsetX = initX || 0;


  if (event.beta) {
    if (event.beta < 91 && event.beta > -91) {
      offsetY = event.beta > 0 ? -event.beta : Math.abs(event.beta)
    } else if (event.beta > 90) {
      offsetY = -90;
    } else if (event.beta < -90) {
      offsetY = 90;
    } else if (event.beta == 0) {
      offsetY = 0;
    }
    console.log(offsetY);
  }

  if (event.gamma) {
    if (event.gamma < 91 && event.gamma > -91) {
      offsetX = event.gamma > 0 ? -event.gamma : Math.abs(event.gamma)
    } else if (event.gamma > 90) {
      offsetX = -90
    } else if (event.gamma < -90) {
      offsetX = 90; 
    } else if (event.beta == 0) {
      offsetX = 0
    }
  }

  let offsetXabs = Math.abs(offsetX);
  let offsetYabs = Math.abs(offsetY);

  if (event.beta > 0) {
    if (offsetXabs < offsetYabs) {
      skewX = offsetX/3
    } else {
      if (event.gamma < 0) {
        skewX = Math.abs(offsetY/3)
      }  else { skewX = offsetY/3}
    }
  } else if(event.beta < 0) {
    if (offsetXabs < offsetYabs) {
      skewX = -(offsetX/3)
    } else {
      if (event.gamma < 0) {
        skewX = -offsetY/3
      } else {
        skewX = offsetY/3
      }
    }
  } else {
    skewX= 0;
  }
  document.getElementById('eight-circle').style.transform = 'translate(' + offsetX + 'px,' + offsetY +'px) scale(' + (1 - (offsetXabs/300)) + ',' + (1 - (offsetYabs/300)) + ') skewX(' + skewX + 'deg)'
  document.getElementById('answer-circle').style.transform = 'translate(' + offsetX/2 + 'px,' + offsetY/2 +'px) skewX(' + skewX/10 + 'deg)'
  // let string = 'translate(' + (-offsetX/1.9) + 'px,' + (-offsetY/1.9) +'px)'
  let string = 'translate(' + -(offsetX/8) + 'px,' + -(offsetY/8) +'px)'

  document.getElementById('answer-container').style.transform = string
  console.log('answercircle:' + offsetX/2 + 'px, ' + offsetY/2 + 'px');
  console.log('answer: ' + -(offsetX/2) + 'px, ' + -(offsetY/2) + 'px', string)
}

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", deviceOrientationListener);
    
} else {
  alert("Sorry, your browser doesn't support Device Orientation");
}

window.addEventListener("devicemotion", handleMotionEvent);


//%% On load initialisation %%

window.addEventListener('load', (e) => {
  console.log('page is fully loaded');

  document.getElementById("start-button").onclick = function(e) {
    e.preventDefault();
    console.log('clicked button', this)
    // Request permission for iOS 13+ devices
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    detectShake = true;

    //Reveal 8 ball
    document.getElementById('eight-ball').style.filter= "none";
    this.style.display = "none";
    
  } 

document.getElementById('reset-button').onclick = (e) => {
  e.preventDefault();
  document.getElementById('eight-circle').style.display = "block";
  document.getElementById('reset-button').style.display = "none"; 
  document.getElementById('answer-circle').style.display = "none"
}

  document.getElementById('view-list-button').onclick = (e) => {
    e.preventDefault();
    showList();
  }

  createList();
});


//%% Util functions%%

function createList() {
  for (let i=0; i < answerList.length; i++) {
    document.getElementById('response-list').innerHTML += `<li>${answerList[i][0]}</li>`
  }
}

function handleMotionEvent(event) {
  var x = event.acceleration.x;
  var y = event.acceleration.y;
  var z = event.acceleration.z;
  
  if (detectShake && Math.round(Math.abs(x) + Math.abs(y) + Math.abs(z)) > 30) {
    showAnswer();
  }
}

function showAnswer() {
  let answer = document.getElementById('answer-container')
  detectShake = false
  answer.classList += "fadeIn";
  setTimeout(function() {
    if (answer.classList.contains("fadeIn")) {
      answer.classList.remove("fadeIn");
    }
    detectShake = true;
  }, 3200);
  changeAnswer();

  document.getElementById('eight-circle').style.display = "none";
  document.getElementById('reset-button').style.display = "block";
  document.getElementById('view-list-button').style.display = "block";
//test
  document.getElementById('answer-circle').style.display = "block"
}

function changeAnswer() {
  currentans = Math.floor(Math.random() * answerList.length)
  document.getElementById('answer-text').style.paddingTop = answerList[currentans][1] + 'px'
  document.getElementById('answer-text').innerText = answerList[currentans][0];
}

function showList() {
  if (!listOpen) {
    document.getElementById('response-list').style.display = 'block';
    document.getElementById('arrow').innerHTML = '&#9660'
    listOpen = true;
  } else {
    document.getElementById('response-list').style.display = 'none';
    document.getElementById('arrow').innerHTML = '&#9650';
    listOpen = false;
  }
}