const compareChannels = (a, b) =>
  a === b
    ? 0
    : a === null
    ? 1
    : b === null
    ? -1
    : a.localeCompare(b, 'en', { numeric: true });

const comparePositions = (a, b) =>
  a.PosOrd > b.PosOrd ? 1 : a.PosOrd < b.PosOrd ? -1 : a.LtOrd - b.LtOrd;

module.exports = { compareChannels, comparePositions };
