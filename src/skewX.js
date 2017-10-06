const Instruction = require('./Instruction'),
   end = new Instruction('restore');

const skewX = (x, ...children) => [
  new Instruction('skewX', { x: Math.tan(x) }),
  children,
  end
];

module.exports = skewX;
