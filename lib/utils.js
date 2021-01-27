function findProperByType(propers, type) {
  if (!Array.isArray(propers)) {
    return null;
  }
  const propersByType = propers.filter((p) => p.type === type);
  return propersByType.length === 0 ? null : propersByType.shift();
}

function hasReadings(propers) {
  return (
    findProperByType(propers, 19) &&
    findProperByType(propers, 2) &&
    findProperByType(propers, 1)
  );
}

/**
 * Return the first collection with a color proper.
 * @param  {...any} allPropers
 */
function findColor(...allPropers) {
  return allPropers.reduce((prev, current) => {
    return prev ?? findProperByType(current, 25);
  }, null)?.text;
}

module.exports = {
  findProperByType,
  hasReadings,
  findColor,
};
