const canvas = document.querySelector("#simscreen");
const ctx = canvas.getContext("2d");
const btnStart = document.querySelector(".btn-start");
const btnReset = document.querySelector(".btn-reset");
const voltageButtons = document.querySelectorAll(".voltage");
const vfspinner = document.querySelector("#vfspinner");
const temperature1 = document.querySelector("#temp1");
const temperature2 = document.querySelector("#temp2");
const temperature3 = document.querySelector("#temp3");
const temperature4 = document.querySelector("#temp4");
const temperature5 = document.querySelector("#temp5");
const btnCheck1 = document.querySelector(".btn-check1");
const btnCheck2 = document.querySelector(".btn-check2");
const btnCheck3 = document.querySelector(".btn-check3");
btnStart.addEventListener("click", initiateProcess);
btnReset.addEventListener("click", resetAll);
voltageButtons.forEach((voltage) =>
  voltage.addEventListener("click", () => setVoltage(voltage))
);

let steadyState = 0;
let currentVoltage = 0;
//controls section
let v = 0;
let vf = 0;

//timing section
let simTimeId = setInterval("", "1000");
let TimeInterval = setInterval("", "1000");
let TimeInterval1 = setInterval("", "1000");
let time = 0;
let time1 = 0;
let time2 = 0;

//point tracing section and initial(atmospheric section)
let t1 = [26, 28.1, 26.5, 27];
var th = [45,45,45,45];
let off = [0, 0, 0, 0, 0];
let slope = [-282.86, -315.71, -354.29];
let k = [40.83, 37.99, 37.61];

//temporary or dummy variables for locking buttons
let temp = 0;
let temp1 = 2;
let temp2 = 0;
let tempslope = 0;
let tempk = 0;
var lmtd = 1, u=1, e = 1, w = [0,0];
function displayDiv(ele) {
  const taskScreen = document.querySelectorAll(".task-screen");
  taskScreen.forEach((task) => {
    task.classList.add("hide");
  });
  if (ele.classList.contains("tool-objective")) {
    document.querySelector(".objective").classList.remove("hide");
  }
  if (ele.classList.contains("tool-description")) {
    document.querySelector(".description").classList.remove("hide");
  }
  if (ele.classList.contains("tool-explore")) {
    document.querySelector(".explore").classList.remove("hide");
    if (temp2 !== 1) {
      drawModel();
      startsim();
      varinit();
    }
  }
  if (ele.classList.contains("tool-practice")) {
    document.querySelector(".practice").classList.remove("hide");
    if (temp2 == 1) {
      temp1 = 1;
      validation();
      // document.querySelector("#info").innerHTML = "Parallel Flow";
    } else{
      document.querySelector("#info").innerHTML =
        "Perform the experiment to solve the questions";
      // document.querySelector(".graph-div").classList.remove("hide");
      document.querySelector(".questions").classList.add("hide");
    }
  }
}
//Change in Variables with respect to time
function varinit() {
  
  
  $('#vslider').slider("value", v);	
	$('#vspinner').spinner("value", v);
  
  if(time2 > 0){ t1[0] += off[0];};
  if(time2 > 0){ t1[1] += off[1];};
  if(time2 > 3){t1[2] += off[2];};
  if(time2 > 3){t1[3] += off[3];};

  if(v == "1"){
    w[0] = 0.135;
    w[1] = 0.140;
    lmtd = 12.51;
    u = 127.60;
    e = 0.31;
    // $("#formula").html("<i>&Theta;<sub>i</sub></i> = T<sub>hi</sub> - T<sub>ci</sub> <br> <i>&Theta;<sub>o</sub></i> = T<sub>ho</sub> - T<sub>co</sub>");
  }
  else if(v == "2"){
    w[0] = 0.137
    w[1] = .100;
    lmtd = 13.98;
    u = 155.08;
    e = 0.56;
    // $("#formula").html("<i>&Theta;<sub>i</sub></i> = T<sub>hi</sub> - T<sub>co</sub> <br> <i>&Theta;<sub>o</sub></i> = T<sub>ho</sub> - T<sub>ci</sub>");
  }
  else{
    w[0] = 0;
    w[1] = 0;
    lmtd = 1;
    u = 1;
    e = 1; 
  }
 
  vfspinner.textContent = vf;
  temperature1.textContent = w;
  temperature2.textContent = t1[0].toFixed(2);
  console.log( t1[1].toFixed(2))
  temperature3.textContent = t1[1].toFixed(2);
  temperature4.textContent = t1[2].toFixed(2);
  temperature5.textContent = t1[3].toFixed(2);


  
}

//water temperature changes
function watertemp() {
  switch (vf) {
    case 0.135:
      t1[6] += 2.2;
      break;
    case 54:
      t1[6] += 1.2;
      break;
   
  }
}

//stops simulations
function simperiod() {
  if (time1 >= 5.0) {
    clearInterval(TimeInterval);
    clearInterval(TimeInterval1);
    time1 = 0;
    time2 = 0;
    temp1 = 0;
    temp2 = 1;
    watertemp();
    $('#playpausebutton').css({
          "opacity":1,
          
          // "pointer-events":"none"
        });
    //printcomment("Click forward button for calculations", 1);
    //printcomment("Click restart button for doing experienment again", 2);

    // ctx.clearRect(620, 485, 100, 50);
    // t1[6] = t1[6].toFixed(1);
    // ctx.font = "15px Comic Sans MS";
    // //ctx.fillText(t1[5]+" \u00B0C", 470, 170);
    // ctx.fillText(t1[6] + " \u00B0C", 650, 500);
    // printcomment("", 2);
  } else {
    drawGradient();
    steadyState = 5 - Math.round(time1);
    document.querySelector(
      ".comment"
    ).innerHTML = `Wait for  ${steadyState} seconds for steady state`;
    btnReset.setAttribute("disabled", true);
    if (steadyState === 0) {
      temp2 = 0;
      document.querySelector(
        ".comment"
      ).innerHTML = `The steady state is achieved`;
      btnReset.removeAttribute("disabled");
    }
    // printcomment(
    //   "Wait for " + (5 - Math.round(time1)) + " seconds for steady state",
    //   2
    // );
  }
}
//draw gradient w.r.t. time in thermometer water flow and heater
function drawGradient(){


  //heater simulation
  var h = 180*time1;
  //create gradient
  var grd1 = ctx.createLinearGradient(0, 0, h, 0)
  grd1.addColorStop(0,"red");
  grd1.addColorStop(1,"white");
  // Fill with gradient
  ctx.fillStyle = grd1;
  ctx.fillRect(158, 78, 305, 28);
   
   if(currentVoltage == "1"){
    //outer parallel tube simulation
    document.querySelector("#info").textContent = "Parallel Flow";
    console.log("par")
    var w = 180*time1;
    //create gradient
    var grd2 = ctx.createLinearGradient(0, 0, w, 0)
    grd2.addColorStop(0,"skyblue");
    grd2.addColorStop(1,"white");
    // Fill with gradient
    ctx.fillStyle = grd2;
    ctx.fillRect(180, 56, 264, 20);
    ctx.fillRect(180, 110, 264, 20);
    ctx.fillRect(184, 48, 15, 10);
    ctx.fillRect(419, 130, 13, 10)
  }
  else{
    //outer tube gradient
    document.querySelector("#info").textContent  = "Counter Flow";
    console.log("count")
    var x = 150*time1;
    var y = 500-x;
    // Create gradient
    var grd = ctx.createLinearGradient(500, 0, y, 0)
    grd.addColorStop(0,"skyblue");
    grd.addColorStop(1,"white");
    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(181, 58, 262, 20);
    ctx.fillRect(182, 108, 262, 20);
    ctx.fillRect(184, 48, 15, 10);
    ctx.fillRect(419, 130, 15, 10)
  }

  
  //cross sectional simulation
  var x = 168,
    y = 281,
    // Radii of the white glow.
    innerRadius = 4*time1,
    outerRadius = 10*time1,
    // Radius of the entire circle.
    radius = 50;

var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
//gradient.addColorStop(0, 'white');
gradient.addColorStop(0, '#ff9999');
gradient.addColorStop(.59,"#99ccff");
gradient.addColorStop(1, 'white');

ctx.arc(168, 281, radius, 0, 2 * Math.PI);

ctx.fillStyle = gradient;
ctx.fill();

  // //thermometer heights add offset
   if(time1 > 0){  th[0] += .9;};
   if(time1 > 0){  th[1] += .7;};
   if(time1 > 3){  th[2] += .6;};
   if(time1 > 3){  th[3] += .9;};

   //thermometers drawing
    ctx.fillStyle = "black";
    ctx.lineJoin = "round";

   //thermometer reading
   ctx.beginPath();
   ctx.fillRect(330.25, 350, 1.5, -th[0]);
   ctx.fillRect(383.25, 350, 1.5, -th[1]);
   ctx.fillRect(438,    350, 1.5, -th[2]);
   ctx.fillRect(489, 350, 1.5, -th[3]);
   ctx.arc(168, 281, 50, 0, 2 * Math.PI);   
   ctx.stroke();
   ctx.beginPath();
   ctx.arc(168, 281, 20, 0, 2 * Math.PI);
   ctx.stroke();
}


// initial model
function drawModel() {
  ctx.clearRect(0, 0, 620, 400); //clears the complete canvas#simscreen everytime

  var background = new Image();
  background.src = "./images//img3.png";
  // document.getElementsByClassName("comment1")[0].innerHTML="<i>Area</i> A = 0.0612 m<sup>2</sup> <br><i>Cp</i> = 4.187 KJ/Kg-K<br>Type: 1. Parallel Flow, 2. Counter Flow"

  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function () {
    //550,400
    ctx.drawImage(background, 85, 35, 490, 350);
    // ctx.clearRect(110, 300, 70, 110);
    ctx.font = "15px Comic Sans MS";
    // ctx.fillText(t1[5] + " \u00B0C", 650, 220);
    // ctx.fillText(t1[6] + " \u00B0C", 650, 500);
    // printcomment(
    //   "<i>Diameter, </i> d = 20mm <br><i> Length interval</i> = 70mm<br><i>Cp</i>  = 4.187kJ/kg-K<br><i> Length of shaded area</i> = 300mm",
    //   1
    // );

    drawGradient();
  };
}

function comment1() {
  if (currentVoltage != 0) {
    time = 0;
    temp = 1;
    // $("#vspinner").spinner({disabled : true});
    // //$("#vfspinner").spinner({disabled : true});
    // $("#vslider").slider({disabled : true});
    // $("#vfslider").slider({disabled : true});
    clearInterval(simTimeId);
    //printcomment("start simulation", 0);
    if (currentVoltage == 1) {
      vf = 0.135;
      w=0.140
    } else if (currentVoltage == 2) {
      vf = 0.137;
      w=0.100
    } 
    offset();
  }
}

//offset for thermometer and temp change
function offset() {
  if (currentVoltage == 1) {
    //path = "./images//currentVoltage1.jpg";
    off[0] = 7;
    off[1] = 2.58;
    off[2] = 0.75;
    off[3] = 5.5;
  } else if (currentVoltage == 2) {
    //path = "./images//currentVoltage2.jpg";
    off[0] = 7;
    off[1] = 2.38;
    off[2] = 0.25;
    off[3] = 9.5;
  } 
  // else if (currentVoltage == 30) {
 
  //   off[0] = 23.7;
  //   off[1] = 22.5;
  //   off[2] = 22;
  //   off[3] = 21.25;
  //   off[4] = 18.5;
  // }
  // temp1 = 0;
  // temp2 = 1;
}
function setVoltage(ele) {
  currentVoltage = Number(ele.value);
  btnStart.removeAttribute("disabled");
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; comment1(); ", "100");
}
function initiateProcess() {
  if (currentVoltage === 0) return;
  btnStart.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => voltage.setAttribute("disabled", true));
  simstate();
}

function simstate() {
  if (temp == 1) {
    temp = 0;
    temp1 = 1;
    TimeInterval = setInterval("time1=time1+.1; simperiod();", "100");
    TimeInterval1 = setInterval("time2=time2+1; varinit()", "1000");
  }
}

//Calculations of the experienment
function validation() {
  datapoints = [
    { x: 0.07, y: t1[0] },
    { x: 0.14, y: t1[1] },
    { x: 0.21, y: t1[2] },
    { x: 0.28, y: t1[3] },
    { x: 0.35, y: t1[4] },
  ];
  //   var datapoints = [];
  // var Ti = (t1[0] + t1[1] + t1[2])/3;
  // var To = (t1[3] + t1[4])/2;
  // var l = 0.5
  // for(var i=45; i<=75; i++){
  //   y = (qtemp*Math.log(75/i))/(2*Math.PI*l*ktemp);
  //   y = Math.round(y * 10)/10;
  //   datapoints.push({x:i, y:y});
  // }

  // drawgraph("graph", datapoints, "radius in mm", "Temperature profile(Ti-To)");
  // document.querySelector(".graph-div").classList.remove("hide");
  document.querySelector(".questions").classList.remove("hide");
  // drawgraph("graph", datapoints, "Length in meter", "Temperature in degree C");
  // if (currentVoltage == 1) {
  //   // tempslope = slope[0];
  //   e = 13.98;
  //   tempk = k[0];
  // } else if (currentVoltage == 2) {
  //   // tempslope = slope[1];
  //   u = 155.08;
  //   e = 155.08;
  //   tempk = k[1];
  // }

  if(currentVoltage == "1"){
    w[0] = 0.135;
    w[1] = 0.140;
    lmtd = 12.51;
  
    u = 127.60;
    e = 0.31;
    $("#formula").html("<i>&Theta;<sub>i</sub></i> = T<sub>hi</sub> - T<sub>ci</sub> <br> <i>&Theta;<sub>o</sub></i> = T<sub>ho</sub> - T<sub>co</sub>");
    // $("#formula").html("<i>&Theta;<sub>i</sub></i> = T<sub>hi</sub> - T<sub>ci</sub> <br> <i>&Theta;<sub>o</sub></i> = T<sub>ho</sub> - T<sub>co</sub>");
  }
  else if(currentVoltage == "2"){
    w[0] = 0.137
    w[1] = .100;
    lmtd = 13.98;
    u = 155.08;
    e = 0.56;
    $("#formula").html("<i>&Theta;<sub>i</sub></i> = T<sub>hi</sub> - T<sub>co</sub> <br> <i>&Theta;<sub>o</sub></i> = T<sub>ho</sub> - T<sub>ci</sub>");
    // $("#formula").html("<i>&Theta;<sub>i</sub></i> = T<sub>hi</sub> - T<sub>co</sub> <br> <i>&Theta;<sub>o</sub></i> = T<sub>ho</sub> - T<sub>ci</sub>");
  }
  else{
    w[0] = 0;
    w[1] = 0;
    lmtd = 1;
    u = 1;
    e = 1; 
  }





  btnCheck1.addEventListener("click", () => validateAnswer1());
  btnCheck2.addEventListener("click", () => validateAnswer2());
  btnCheck3.addEventListener("click", () => validateAnswer3());
  drawGradient();
}

function validateAnswer1() {
  const correctAnswer = document.querySelector(".correct-answer1");
  const unit = document.querySelector(".question-unit1");
  unit.innerHTML = `<sup>&deg;</sup>C`;
  let userEnteredValue = Number(
    document.querySelector(".question-input1").value
  );
  let answer = userEnteredValue === lmtd ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${lmtd} <sup>&deg;</sup>C`;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function validateAnswer2() {
  const correctAnswer = document.querySelector(".correct-answer2");
  const unit = document.querySelector(".question-unit2");
  unit.innerHTML = ``;
  let userEnteredValue = Number(
    document.querySelector(".question-input2").value
  );
  let answer = userEnteredValue === e ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${e} `;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function validateAnswer3() {
  const correctAnswer = document.querySelector(".correct-answer3");
  const unit = document.querySelector(".question-unit3");
  unit.innerHTML = ``;
  let userEnteredValue = Number(
    document.querySelector(".question-input3").value
  );
  let answer = userEnteredValue === u ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${u} W/m.K`;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function resetAll() {
  btnStart.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => {
    voltage.removeAttribute("disabled");
    voltage.checked = false;
  });
  document.querySelector(".comment").innerHTML = "";
  // if (temp1 == 0) {
  temp2 = 0;
  temp1 = 2;
  t1 = [26, 28.1, 26.5, 27];
  th = [45, 45, 45, 45, 45];
  currentVoltage = 0;
  vf = 0;
  // w =0;
  // document.querySelector(".correct-answer1").innerHTML = "";
  // document.querySelector(".question-unit1").innerHTML = `<sup>&deg;</sup>C/m`;
  // document.querySelector(".question-input1").value = "";
  document.querySelector(".correct-answer2").innerHTML = "";
  document.querySelector(".question-unit2").innerHTML = `W/m.K`;
  document.querySelector(".question-input2").value = "";
  varinit();
  startsim();
  drawModel();
}

function movetoTop() {
  practiceDiv.scrollIntoView();
}
