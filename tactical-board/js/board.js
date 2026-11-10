const tokensLayer = document.getElementById("tokens");
const formationSelect = document.getElementById("formation-select");

const dialog = document.getElementById("player-dialog");
const playerForm = document.getElementById("player-form");
const nameInput = document.getElementById("player-name");
const numberInput = document.getElementById("player-number");
const posSelect = document.getElementById("player-pos");
const errorText = document.getElementById("player-error");
const cancelButton = document.getElementById("player-cancel");

let players = [];          
let editingIndex = null;   

function fillFormationSelect() {
  for (const key in FORMATIONS) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = FORMATIONS[key].label;
    formationSelect.appendChild(option);
  }
}

function fillPositionSelect() {
  POSITIONS.forEach(function (pos) {
    const option = document.createElement("option");
    option.value = pos;
    option.textContent = pos;
    posSelect.appendChild(option);
  });
}

function loadFormation(key) {
  players = FORMATIONS[key].spots.map(function (spot, i) {
    const old = players[i];  
    return {
      pos: spot.pos,
      x: spot.x,
      y: spot.y,
      name: old ? old.name : "",
      number: old ? old.number : ""
    };
  });
  drawTokens();
}

function drawTokens() {
  tokensLayer.innerHTML = "";

  players.forEach(function (player, index) {
    const token = document.createElement("div");
    token.classList.add("token");

    if (player.pos === "GK") {
      token.classList.add("gk");
    }

    token.style.left = player.x + "%";
    token.style.top = player.y + "%";

    token.textContent = player.number || player.pos;

    const label = document.createElement("span");
    label.classList.add("token-name");
    label.textContent = player.name || player.pos;
    token.appendChild(label);

    makeInteractive(token, index);
    tokensLayer.appendChild(token);
  });
}

// ---------- Dragging + clicking ----------
function makeInteractive(token, index) {
  let startX = 0;
  let startY = 0;
  let moved = false;

  token.addEventListener("pointerdown", function (event) {
    token.setPointerCapture(event.pointerId);
    token.classList.add("dragging");
    startX = event.clientX;
    startY = event.clientY;
    moved = false;
  });

  token.addEventListener("pointermove", function (event) {
    if (!token.hasPointerCapture(event.pointerId)) {
      return;
    }

    // has the pointer travelled far enough to count as a drag?
    if (Math.abs(event.clientX - startX) > 5 || Math.abs(event.clientY - startY) > 5) {
      moved = true;
    }
    if (!moved) {
      return;
    }

    const box = tokensLayer.getBoundingClientRect();
    let x = ((event.clientX - box.left) / box.width) * 100;
    let y = ((event.clientY - box.top) / box.height) * 100;

    x = Math.min(Math.max(x, 3), 97);
    y = Math.min(Math.max(y, 3), 97);

    token.style.left = x + "%";
    token.style.top = y + "%";

    // keep the data in sync with what's on screen
    players[index].x = x;
    players[index].y = y;
  });

  token.addEventListener("pointerup", function (event) {
    token.releasePointerCapture(event.pointerId);
    token.classList.remove("dragging");

    if (!moved) {
      openDialog(index);   // it was a click, not a drag
    }
  });

  token.addEventListener("pointercancel", function () {
    token.classList.remove("dragging");
  });
}

// ---------- The edit dialog ----------
function openDialog(index) {
  editingIndex = index;
  const player = players[index];

  nameInput.value = player.name;
  numberInput.value = player.number;
  posSelect.value = player.pos;
  errorText.textContent = "";

  dialog.showModal();
}

playerForm.addEventListener("submit", function (event) {
  event.preventDefault();   // stop the browser reloading the page

  const name = nameInput.value.trim();
  const number = numberInput.value === "" ? "" : String(Number(numberInput.value));

  if (name === "") {
    errorText.textContent = "Please enter a name.";
    return;
  }

  if (number !== "") {
    const n = Number(number);

    if (!Number.isInteger(n) || n < 1 || n > 99) {
      errorText.textContent = "Number must be a whole number from 1 to 99.";
      return;
    }

    const taken = players.some(function (p, i) {
      return i !== editingIndex && p.number === number;
    });

    if (taken) {
      errorText.textContent = "Number " + number + " is already used.";
      return;
    }
  }

  players[editingIndex].name = name;
  players[editingIndex].number = number;
  players[editingIndex].pos = posSelect.value;

  dialog.close();
  drawTokens();
});

cancelButton.addEventListener("click", function () {
  dialog.close();
});

// ---------- Formation dropdown ----------
formationSelect.addEventListener("change", function () {
  loadFormation(formationSelect.value);
});

// ---------- Start the app ----------
fillFormationSelect();
fillPositionSelect();
loadFormation(formationSelect.value);