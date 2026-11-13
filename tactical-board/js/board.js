// ---------- Elements ----------
const tokensLayer = document.getElementById("tokens");
const formationSelect = document.getElementById("formation-select");

const benchList = document.getElementById("bench-list");
const benchHint = document.getElementById("bench-hint");
const addSubButton = document.getElementById("add-sub");

const dialog = document.getElementById("player-dialog");
const dialogTitle = document.getElementById("dialog-title");
const playerForm = document.getElementById("player-form");
const nameInput = document.getElementById("player-name");
const numberInput = document.getElementById("player-number");
const posSelect = document.getElementById("player-pos");
const errorText = document.getElementById("player-error");
const cancelButton = document.getElementById("player-cancel");

let players = [];       
let bench = [];         
let editing = null;     
let swapIndex = null;   

const MAX_SUBS = 9;

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

function makeButton(symbol, title, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = symbol;
  button.title = title;
  button.addEventListener("click", onClick);
  return button;
}

function drawBench() {
  benchList.innerHTML = "";

  if (bench.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("hint");
    empty.textContent = "No substitutes yet.";
    benchList.appendChild(empty);
  }

  bench.forEach(function (sub, index) {
    const row = document.createElement("div");
    row.classList.add("bench-item");

    if (index === swapIndex) {
      row.classList.add("selected");
    }

    const num = document.createElement("span");
    num.classList.add("bench-num");
    num.textContent = sub.number || "-";

    const info = document.createElement("span");
    info.classList.add("bench-info");
    info.textContent = (sub.name || "(no name)") + " · " + sub.pos;

    row.appendChild(num);
    row.appendChild(info);
    row.appendChild(makeButton("✎", "Edit", function () { openDialog("bench", index); }));
    row.appendChild(makeButton("⇄", "Swap with a starter", function () { startSwap(index); }));
    row.appendChild(makeButton("✕", "Remove", function () { removeSub(index); }));

    benchList.appendChild(row);
  });

  addSubButton.disabled = bench.length >= MAX_SUBS;
}

function removeSub(index) {
  const name = bench[index].name || "this player";
  if (!confirm("Remove " + name + " from the bench?")) {
    return;
  }
  bench.splice(index, 1);
  cancelSwap();   
}

function startSwap(index) {
  if (swapIndex === index) {
    cancelSwap();          
    return;
  }
  swapIndex = index;
  updateSwapUI();
}

function cancelSwap() {
  swapIndex = null;
  updateSwapUI();
}

function updateSwapUI() {
  tokensLayer.classList.toggle("swap-mode", swapIndex !== null);

  if (swapIndex !== null) {
    benchHint.textContent = "Now click a player on the pitch to swap. Press ⇄ again to cancel.";
  } else {
    benchHint.textContent = "";
  }

  drawBench();
}

function swapWithBench(pitchIndex) {
  const starter = players[pitchIndex];
  const sub = bench[swapIndex];

  const outgoing = { name: starter.name, number: starter.number, pos: starter.pos };

  starter.name = sub.name;
  starter.number = sub.number;

  bench[swapIndex] = outgoing;

  swapIndex = null;
  updateSwapUI();
  drawTokens();
}

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

    players[index].x = x;
    players[index].y = y;
  });

  token.addEventListener("pointerup", function (event) {
    token.releasePointerCapture(event.pointerId);
    token.classList.remove("dragging");

    if (!moved) {
      if (swapIndex !== null) {
        swapWithBench(index);
      } else {
        openDialog("pitch", index);
      }
    }
  });

  token.addEventListener("pointercancel", function () {
    token.classList.remove("dragging");
  });
}

function openDialog(list, index) {
  editing = { list: list, index: index };

  let person;

  if (list === "pitch") {
    person = players[index];
    dialogTitle.textContent = "Edit player";
  } else if (index === null) {
    person = { name: "", number: "", pos: "CM" };    
    dialogTitle.textContent = "Add substitute";
  } else {
    person = bench[index];
    dialogTitle.textContent = "Edit substitute";
  }

  nameInput.value = person.name;
  numberInput.value = person.number;
  posSelect.value = person.pos;
  errorText.textContent = "";

  dialog.showModal();
}

function isNumberTaken(number) {
  const onPitch = players.some(function (p, i) {
    const isMe = editing.list === "pitch" && editing.index === i;
    return !isMe && p.number === number;
  });

  const onBench = bench.some(function (p, i) {
    const isMe = editing.list === "bench" && editing.index === i;
    return !isMe && p.number === number;
  });

  return onPitch || onBench;
}

playerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const number = numberInput.value === "" ? "" : String(Number(numberInput.value));

  if (name === "") {
    errorText.textContent = "Please enter a name.";
    return;
  }

  if (number !== "") {
    const n = Number(number);

    if (!Number.isInteger(n) || n < 1 || n > 99) {
      errorText.textContent = "Number must be from 1 to 99.";
      return;
    }

    if (isNumberTaken(number)) {
      errorText.textContent = "Number " + number + " is already used.";
      return;
    }
  }

  const pos = posSelect.value;

  if (editing.list === "pitch") {
    players[editing.index].name = name;
    players[editing.index].number = number;
    players[editing.index].pos = pos;
    drawTokens();
  } else if (editing.index === null) {
    bench.push({ name: name, number: number, pos: pos });
    drawBench();
  } else {
    bench[editing.index] = { name: name, number: number, pos: pos };
    drawBench();
  }

  dialog.close();
});

cancelButton.addEventListener("click", function () {
  dialog.close();
});

addSubButton.addEventListener("click", function () {
  openDialog("bench", null);
});

formationSelect.addEventListener("change", function () {
  loadFormation(formationSelect.value);
});

fillFormationSelect();
fillPositionSelect();
loadFormation(formationSelect.value);
drawBench();