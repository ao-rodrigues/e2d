const Instruction = require('./Instruction'),
  end = new Instruction('restore');

const rotate = (r, ...children) => [
  new Instruction('rotate', { cos: Math.cos(r), sin: Math.sin(r) }),
  children,
  end
];

module.exports = rotate;
