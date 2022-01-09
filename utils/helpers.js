const compareChannels = (a, b) =>
  a === b
    ? 0
    : a === null
    ? 1
    : b === null
    ? -1
    : a.localeCompare(b, 'en', { numeric: true });

module.exports = { compareChannels };
