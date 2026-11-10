// ---------- Elements ----------
const lineupNameInput = document.getElementById("lineup-name");
const saveLineupButton = document.getElementById("save-lineup");
const lineupMessage = document.getElementById("lineup-message");
const lineupList = document.getElementById("lineup-list");

// ---------- Small helpers ----------
function showLineupMessage(text, isError) {
  lineupMessage.textContent = text;
  lineupMessage.classList.toggle("error", isError === true);
}

// find a lineup by name (ignoring upper/lower case); skip the one with ignoreId
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

// ---------- Draw the saved list ----------
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

// ---------- Save ----------
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
    lineups[lineups.indexOf(existing)] = entry;   // replace in the same spot
  } else {
    lineups.unshift(entry);                       // new ones go to the top
  }

  if (writeLineups(lineups)) {
    showLineupMessage('Saved "' + name + '".', false);
    drawLineups();
  } else {
    showLineupMessage("Could not save: browser storage is unavailable or full.", true);
  }
}

// ---------- Load ----------
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

  formationSelect.value = lineup.formation;   // make the dropdown match
  players = lineup.players;                   // swap in the saved data...
  bench = lineup.bench;
  lineupNameInput.value = lineup.name;

  cancelSwap();      // drop any half-finished swap (this also redraws the bench)
  drawTokens();      // ...and redraw the pitch from it

  showLineupMessage('Loaded "' + lineup.name + '".', false);
}

// ---------- Rename ----------
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
    return;   // the coach pressed Cancel
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

// ---------- Delete ----------
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

// ---------- Wire up the controls ----------
saveLineupButton.addEventListener("click", saveCurrentLineup);

lineupNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    saveCurrentLineup();
  }
});

// ---------- Start ----------
drawLineups();