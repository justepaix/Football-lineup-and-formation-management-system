const lineupNameInput = document.getElementById("lineup-name");
const saveLineupButton = document.getElementById("save-lineup");
const lineupMessage = document.getElementById("lineup-message");
const lineupList = document.getElementById("lineup-list");

function showLineupMessage(text, isError) {
  lineupMessage.textContent = text;
  lineupMessage.classList.toggle("error", isError === true);
}

function findByName(lineups, name, ignoreId) {
  const wanted = name.toLowerCase();

  return lineups.find(function (lineup) {
    return lineup.id !== ignoreId && lineup.name.toLowerCase() === wanted;
  });
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function drawLineups() {
  const lineups = readLineups();
  lineupList.innerHTML = "";

  if (lineups.length === 0) {
    const empty = document.createElement("p");
    empty.classList.add("hint");
    empty.textContent = "No saved lineups yet.";
    lineupList.appendChild(empty);
    return;
  }

  lineups.forEach(function (lineup) {
    const row = document.createElement("div");
    row.classList.add("lineup-item");

    const info = document.createElement("div");
    info.classList.add("lineup-info");

    const name = document.createElement("div");
    name.classList.add("lineup-name");
    name.textContent = lineup.name;

    const meta = document.createElement("div");
    meta.classList.add("lineup-meta");
    meta.textContent = lineup.formation + " · " + formatDate(lineup.savedAt);

    info.appendChild(name);
    info.appendChild(meta);

    const loadButton = makeButton("Load", "Load this lineup", function () {
      loadLineup(lineup.id);
    });
    loadButton.classList.add("load-btn");

    row.appendChild(info);
    row.appendChild(loadButton);
    row.appendChild(makeButton("✎", "Rename", function () { renameLineup(lineup.id); }));
    row.appendChild(makeButton("✕", "Delete", function () { deleteLineup(lineup.id); }));

    lineupList.appendChild(row);
  });
}

function saveCurrentLineup() {
  const name = lineupNameInput.value.trim();

  if (name === "") {
    showLineupMessage("Give the lineup a name first.", true);
    return;
  }

  const lineups = readLineups();
  const existing = findByName(lineups, name, null);

  if (existing) {
    const ok = confirm('A lineup called "' + existing.name + '" already exists. Replace it?');
    if (!ok) {
      return;
    }
  }

  const entry = {
    id: existing ? existing.id : Date.now(),
    name: name,
    formation: formationSelect.value,
    players: players,
    bench: bench,
    savedAt: Date.now()
  };

  if (existing) {
    lineups[lineups.indexOf(existing)] = entry;   
  } else {
    lineups.unshift(entry);                       
  }

  if (writeLineups(lineups)) {
    showLineupMessage('Saved "' + name + '".', false);
    drawLineups();
  } else {
    showLineupMessage("Could not save: browser storage is unavailable or full.", true);
  }
}

function loadLineup(id) {
  const lineup = readLineups().find(function (l) {
    return l.id === id;
  });

  if (!lineup) {
    return;
  }

  if (!FORMATIONS[lineup.formation]) {
    showLineupMessage("That lineup uses a formation that no longer exists.", true);
    return;
  }

  formationSelect.value = lineup.formation;   
  players = lineup.players;                   
  bench = lineup.bench;
  lineupNameInput.value = lineup.name;

  cancelSwap();      
  drawTokens();      

  showLineupMessage('Loaded "' + lineup.name + '".', false);
}

function renameLineup(id) {
  const lineups = readLineups();
  const lineup = lineups.find(function (l) {
    return l.id === id;
  });

  if (!lineup) {
    return;
  }

  const answer = prompt("New name for this lineup:", lineup.name);

  if (answer === null) {
    return;   
  }

  const newName = answer.trim();

  if (newName === "") {
    showLineupMessage("The name can't be empty.", true);
    return;
  }

  if (findByName(lineups, newName, lineup.id)) {
    showLineupMessage('You already have a lineup called "' + newName + '".', true);
    return;
  }

  lineup.name = newName;
  writeLineups(lineups);
  drawLineups();
  showLineupMessage("Renamed.", false);
}

function deleteLineup(id) {
  const lineups = readLineups();
  const lineup = lineups.find(function (l) {
    return l.id === id;
  });

  if (!lineup) {
    return;
  }

  if (!confirm('Delete "' + lineup.name + '"? This cannot be undone.')) {
    return;
  }

  const remaining = lineups.filter(function (l) {
    return l.id !== id;
  });

  writeLineups(remaining);
  drawLineups();
  showLineupMessage("Deleted.", false);
}

saveLineupButton.addEventListener("click", saveCurrentLineup);

lineupNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    saveCurrentLineup();
  }
});

const resetButton = document.getElementById("reset-board");

resetButton.addEventListener("click", function () {
  const ok = confirm("Reset the board? Names, numbers, positions and substitutes will be cleared. Saved lineups are not affected.");

  if (!ok) {
    return;
  }

  players = [];   
  bench = [];
  loadFormation(formationSelect.value);

  cancelSwap();   
  lineupNameInput.value = "";
  showLineupMessage("", false);
});

drawLineups();