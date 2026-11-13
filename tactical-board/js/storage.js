const STORAGE_KEY = "tactical-board-lineups";

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

function writeLineups(lineups) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lineups));
    return true;
  } catch (error) {
    return false;
  }
}