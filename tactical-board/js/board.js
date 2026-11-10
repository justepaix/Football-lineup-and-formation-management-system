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
    tokensLayer.appendChild(token);
  });
}

formationSelect.addEventListener("change", function () {
  renderFormation(formationSelect.value);
});

fillFormationSelect();
renderFormation(formationSelect.value);