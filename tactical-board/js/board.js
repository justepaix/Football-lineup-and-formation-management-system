const tokensLayer = document.getElementById("tokens");
const formationSelect = document.getElementById("formation-select");

function fillFormationSelect() {
  for (const key in FORMATIONS) {
    const option = document.createElement("option");
    option.value = key;                        
    option.textContent = FORMATIONS[key].label;
    formationSelect.appendChild(option);
  }
}
function makeDraggable(token) {

  token.addEventListener("pointerdown", function (event) {
    token.setPointerCapture(event.pointerId);
    token.classList.add("dragging");
  });

  token.addEventListener("pointermove", function (event) {
    if (!token.hasPointerCapture(event.pointerId)) {
      return;
    }
    const box = tokensLayer.getBoundingClientRect();

    let x = ((event.clientX - box.left) / box.width) * 100;
    let y = ((event.clientY - box.top) / box.height) * 100;

    x = Math.min(Math.max(x, 3), 97);
    y = Math.min(Math.max(y, 3), 97);

    token.style.left = x + "%";
    token.style.top = y + "%";
  });

  token.addEventListener("pointerup", function (event) {
    token.releasePointerCapture(event.pointerId);
    token.classList.remove("dragging");
  });

  token.addEventListener("pointercancel", function () {
    token.classList.remove("dragging");
  });
}

function renderFormation(key) {
  tokensLayer.innerHTML = "";  
  const spots = FORMATIONS[key].spots;

  spots.forEach(function (spot, index) {
    const token = document.createElement("div");
    token.classList.add("token");

    if (spot.pos === "GK") {
      token.classList.add("gk");
    }
    token.textContent = spot.pos;
    token.style.left = spot.x + "%";
    token.style.top = spot.y + "%";
    token.dataset.index = index;
    makeDraggable(token);
    tokensLayer.appendChild(token);
  });
}

formationSelect.addEventListener("change", function () {
  renderFormation(formationSelect.value);
});

fillFormationSelect();
renderFormation(formationSelect.value);