const Instruction = require('./Instruction'),
   end = new Instruction('restore');

const skewY = (y, ...children) => [
  new Instruction('skewY', { y: Math.tan(y) }),
  children,
  end
];

module.exports = skewY;
