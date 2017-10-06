const setTransform = require('./setTransform');

const resetTransform = (...children) => setTransform([1, 0, 0, 1, 0, 0], children);

module.exports = resetTransform;