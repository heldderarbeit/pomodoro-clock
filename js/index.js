var sessionMins = 25;
var breakMins = 5;
var leftSecs = 1500;
var leftSecsBreak = 300;
var timerActive = false;
var breakModus = false;
var timeExpired = false;

const greenBorderColor = "#99CC00";
const greenColor = "#b7db4c";
const redBorderColor = "#FF0000";
const redColor = "#ff6f6f";

function setToStart() {
  // refresh display of timer settings
  refreshTimerSettings();
  // skip to session timer
  setBorder(greenBorderColor);
  changeToSessionStart();
};

function refreshTimerSettings() {
  $("#timeSetTextSession").text(sessionMins);
  $("#timeSetTextBreak").text(breakMins);
  leftSecs = sessionMins * 60;
  leftSecsBreak = breakMins * 60;
};

function setBorder(borderparam) {
  $("#timerButton").css("border-color", borderparam);
  $("#timerButton").css("background", greenColor);
};

function changeToSessionStart() {
  breakModus = false;
  leftSecs = sessionMins * 60;
  $("#timerButton").html("Session<br/>" + Math.floor(leftSecs / 60) + " min");
};

function formattedTimeUnit(dMins, dSecs) {
  this.dMins = dMins;
  this.dSecs = dSecs;
};

function getFormattedTimeUnit(secs) {
  var dMins = Math.floor(secs / 60);
  var dSecs = secs - (dMins * 60);
  // prepends zero to one-digit numbers
  if (0 <= dSecs && dSecs <= 9) {
    dSecs = "0" + dSecs;
  }
  return new formattedTimeUnit(dMins, dSecs);
};

function displaySessionInfo() {
  var t = getFormattedTimeUnit(leftSecs);
  $("#timerButton").html("Session<br/>" + t.dMins + ":" + t.dSecs);
  showProgress("session", leftSecs, sessionMins);
};

function displayBreakInfo() {
  var t = getFormattedTimeUnit(leftSecsBreak);
  $("#timerButton").html("Break!<br/>" + t.dMins + ":" + t.dSecs);
  showProgress("break", leftSecsBreak, breakMins);
};

function showProgress(mode, secs, secsTotal) {
  var percentFillTemp = 1 - (secs / (secsTotal * 60));
  percentFillTemp *= 100;
  percentFill = percentFillTemp + "%";
  percentFill2 = 100 - percentFillTemp;
  percentFill2 += "%";
  var fillColor = undefined;
  if (mode === "session") {
    fillColor = greenBorderColor;
  } else if (mode === "break") {
    fillColor = redBorderColor;
  }
  var backgroundColor;
  if (mode === "session") {
    backgroundColor = greenColor;
  } else if (mode === "break") {
    backgroundColor = redColor;
  }
  var backgroundFill = undefined;
  if (percentFillTemp <= 50) {
    backgroundFill = "linear-gradient(to bottom, " + backgroundColor + " " + percentFill2 + ", " + fillColor + " " + percentFill + ")";
  } else {
    backgroundFill = "linear-gradient(to top, " + fillColor + " " + percentFill + ", " + backgroundColor + " " + percentFill2 + ")";
  }
  console.log(backgroundFill);
  $("#timerButton").css("background-image", backgroundFill);
};

/* events */
$(".controlBox button").click(function(event) {
  console.log(event.target);
  if (!timerActive) {
    if (event.target.id === "plusTextSession") {
      if (sessionMins < 99) {
        sessionMins++;
      }
    }
    if (event.target.id === "minusTextSession") {
      if (sessionMins > 1) {
        sessionMins--;
      }
    }
    if (event.target.id === "plusTextBreak") {
      if (breakMins < 99) {
        breakMins++;
      }
    }
    if (event.target.id === "minusTextBreak") {
      if (breakMins >= 1) {
        breakMins--;
      }
    }
    setToStart();
  }
});

$("#timerButton").click(function() {
  timerActive = !timerActive;
});

$("#resetButton").click(function() {
  setToStart();
});

/* app loop */
// counts timer down every 1000 milliseconds
window.setInterval(function() {
  // timer is not paused
  if (timerActive) {
    //timer is in session mode
    if (!breakModus) {
      setBorder(greenBorderColor);
      if (leftSecs > 0) {
        leftSecs--;
        // session is over
        if (leftSecs === 0) {
          // user has set break length to 0 -> timer stops
          if (breakMins === 0) {
            timerActive = false;
            timeExpired = true;
          } else {
            //enter break mode
            breakModus = true;
          }
        }
        displaySessionInfo();
      }
      //entering break mode
    } else {
      setBorder(redBorderColor);
      if (leftSecsBreak >= 0) {
        displayBreakInfo();
        leftSecsBreak--;
        if (leftSecsBreak < 0) {
          setTimeout(function() {
            setToStart();
          }, 1000);
        }
      }
    }
    // resetting the timer to previous values 
  } else if (timeExpired) {
    setToStart();
  }
}, 1000);
