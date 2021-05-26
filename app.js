const apiurl = "https://cdn-api.co-vin.in/api/v2/";
let districtFetch = false;
let centerFetch = false;

let newage = null;
let interval = null;

function getDistricts() {
  let stateId = document.getElementById("lists").value;
  if (stateId == "0") {
    alert("Please select a valid State!");
    return;
  }
  fetch(`${apiurl}admin/location/districts/${stateId}`)
    .then((districts) => {
      return districts.json();
    })
    .then(displayDistricts);
}
function displayDistricts(districts) {
  document.getElementById("lists").innerHTML = null;
  let def = document.createElement("option");
  def.text = "Select your District";
  def.value = "0";
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
  let datelabel = document.createElement("span");
  datelabel.innerHTML = "Select Date:";
  let date = document.createElement("input");
  date.type = "date";
  date.id = "dateselected";
  forms.insertBefore(datelabel, forms.childNodes[2]);
  forms.insertBefore(date, forms.childNodes[3]);
  let agelist = document.createElement("select");
  agelist.id = "age";
  let option0 = document.createElement("option");
  option0.value = "0";
  option0.text = "Select your Age";
  option0.selected;
  option0.disabled;
  agelist.add(option0);
  let option1 = document.createElement("option");
  option1.value = "18";
  option1.text = "18+";

  agelist.add(option1);
  let option2 = document.createElement("option");
  option2.value = "45";
  option2.text = "45+";
  agelist.add(option2);
  forms.insertBefore(agelist, forms.childNodes[4]);
  document.getElementById("btn").innerHTML = "Find";

  document.getElementById("btn").onclick = function () {
    setAge(document.getElementById("age").value);
    isValid(
      document.getElementById("lists").value,
      document.getElementById("dateselected").value
    );
  };
}
function isValid(district_id, date) {
  if (district_id == "0" || newage == 0 || date == "") {
    alert("Atleast one of the detail(s) entered is invalid!");
    return;
  } else {
    runscript(
      document.getElementById("lists").value,
      document.getElementById("dateselected").value
    );
  }
}
function setAge(age) {
  newage = parseInt(age);
}
function runscript(district_id, date) {
  let section = document.getElementById("section");
  section.innerHTML = null;
  let head = document.createElement("h3");
  head.id = "checking";
  let headtext = document.createTextNode(
    "Slots are being continuously checked in the background. We will notify you when the slots are available for your selected preference. Kindly login into your cowin portal before hand. DO NOT refresh the page."
  );
  head.appendChild(headtext);
  section.appendChild(head);
  document.getElementById("checking").style.fontSize = "24px";
  document.getElementById("checking").style.textAlign = "center";
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
  console.log(centers);
  console.log("Still Working");
  for (let i of centers.sessions) {
    if (i.min_age_limit == newage && i.available_capacity > 0) {
      arr.push(i);
    }
  }
  if (arr.length > 0) {
    clearInterval(interval);
    let section = document.getElementById("section");
    section.innerHTML = `<h1 style = "text-align:center;">We have found some centers for you.</h1><hr>`;
    for (let i of arr) {
      let heading = document.createElement("h3");
      let para = document.createElement("p");
      let htext = document.createTextNode(`${i.name}`);
      let ptext = document.createTextNode(`${i.address}`);
      heading.appendChild(htext);
      para.appendChild(ptext);
      heading.classList.add("centername");
      para.classList.add("centeraddress");
      section.appendChild(heading);
      section.appendChild(para);
    }
    let audio = new Audio("beep.wav");
    audio.play();
  }
}

