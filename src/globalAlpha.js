const Instruction = require('./Instruction'),
  end = new Instruction('endGlobalAlpha');

const globalAlpha = (value, ...children) => [
  new Instruction('globalAlpha', { value }),
  children,
  end
];
module.exports = globalAlpha;
