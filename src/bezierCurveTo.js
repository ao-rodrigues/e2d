const Instruction = require('./Instruction');

const bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => new Instruction('call', {
  name: 'bezierCurveTo',
  args: [cp1x, cp1y, cp2x, cp2y, x, y],
  count: 5
});

module.exports = bezierCurveTo;