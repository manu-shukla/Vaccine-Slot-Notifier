const apiurl = "https://cdn-api.co-vin.in/api/v2/";
let districtFetch = false;
let centerFetch = false;
let age = null;
let newage;
let interval;
function reload() {
  window.location.reload();
  return;
}
function getDistricts() {
  let stateId = document.getElementById("lists").value;
  fetch(`${apiurl}admin/location/districts/${stateId}`)
    .then((districts) => {
      return districts.json();
    })
    .then(displayDistricts);
}
function displayDistricts(districts) {
  console.log(districts.districts[2]);

  document.getElementById("lists").innerHTML = null;
  let def = document.createElement("option");
  def.text = "Select your District";
  def.value = 0;
  def.selected;
  def.disabled;
  lists.add(def);
  for (let i of districts.districts) {
    let option = document.createElement("option");
    option.text = `${i.district_name}`;
    option.value = `${i.district_id}`;
    lists.add(option);
  }
  let forms = document.getElementById("details");
  let date = document.createElement("input");
  date.type = "date";
  date.id = "dateselected";
  forms.insertBefore(date, forms.childNodes[2]);
  let agelist = document.createElement("select");
  agelist.id = "age";
  let option1 = document.createElement("option");
  option1.value = "18";
  option1.text = "18+";

  agelist.add(option1);
  let option2 = document.createElement("option");
  option2.value = "45";
  option2.text = "45+";
  agelist.add(option2);
  forms.insertBefore(agelist, forms.childNodes[3]);
  document.getElementById("btn").innerHTML = "Find";
  age = document.getElementById("age").value;
  newage = parseInt(age);
  document.getElementById("btn").onclick = function () {
    runscript(
      document.getElementById("lists").value,
      document.getElementById("dateselected").value
    );
  };
}
function runscript(district_id, date) {
  let section = document.getElementById("section");
  section.innerHTML =
    "Slots are being continuously checked in the background. We will notify you when the slots are available for your selected preference. Kindly login into your cowin portal before hand. DO NOT refresh the page.";
  let newDate = dateFormat(date);
  interval = setInterval(getCenters, 4000, district_id, newDate);
}
function getCenters(district_id, date) {
  fetch(
    `${apiurl}appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${date}`
  )
    .then((centers) => {
      return centers.json();
    })
    .then(displayCenters);
}
function dateFormat(date) {
  let s =
    date[8] +
    date[9] +
    "-" +
    date[5] +
    date[6] +
    "-" +
    date[0] +
    date[1] +
    date[2] +
    date[3];
  return s;
}

function displayCenters(centers) {
  let arr = [];
console.log("Still Working");
  for (let i of centers.sessions) {
    if (i.min_age_limit == newage) {
      arr.push(i);
    }
  }
  if (arr.length > 0) {
    clearInterval(interval);
    let section = document.getElementById("section");
    section.innerHTML = "<h1>We have found some centers for you.</h1>";
    for (let i of arr) {
      let heading = document.createElement("h3");
      let para = document.createElement("p");
      let htext = document.createTextNode(`${i.name}`);
      let ptext = document.createTextNode(`${i.address}`);
      heading.appendChild(htext);
      para.appendChild(ptext);
      section.appendChild(heading);
      section.appendChild(para);
    }
    let audio = new Audio('beep.wav');
    audio.play();
  }
  
}

// function displayCenters(centers) {
//   console.log(centers);
//   let centerList = document.createElement("select");
//   centerList.id = "centerlist";
//   document.getElementById("centers").appendChild(centerList);
//   let lists = document.getElementById("centerlist");
//   let def = document.createElement("option");
//   def.text = "Select your Center";
//   def.value = 0;
//   def.selected;
//   def.disabled;
//   lists.add(def);

//   let newage = parseInt(age);
//   let k = 0;
//   for (let i of centers.sessions) {
//     // if (i.min_age_limit == newage) {
//     let option = document.createElement("option");
//     option.text = `${i.name}`;
//     option.value = `${k}`;
//     lists.add(option);
//     // }
//     ++k;
//   }
//   if (lists.length == 1) {
//     alert("No Centers Available for the selected date");
//     location.reload();
//     return;
//   }
//   let button = document.createElement("button");
//   button.innerHTML = "Execute the Search";
//   button.onclick = function () {
//     runscript(centers.sessions[document.getElementById("centerlist").value]);
//   };

//   document.getElementById("centers").appendChild(button);
// }
