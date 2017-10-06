const beginPath = require('./beginPath')(),
    closePath = require('./closePath')();

const path = (...children) => [
  beginPath,
  children,
  closePath
];

module.exports = path;
