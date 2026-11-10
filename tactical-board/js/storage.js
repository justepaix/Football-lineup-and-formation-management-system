// All the localStorage code lives here, so the rest of the app never touches it directly.

const STORAGE_KEY = "tactical-board-lineups";

// Get the list of saved lineups (an empty list if there's nothing, or if the data is broken)
function readLineups() {
  try {
    const text = localStorage.getItem(STORAGE_KEY);

    if (!text) {
      return [];
    }

    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

// Store the list. Returns true if it worked, false if the browser refused.
function writeLineups(lineups) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineups));
    return true;
  } catch (error) {
    return false;
  }
}