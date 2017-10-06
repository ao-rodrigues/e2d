const Instruction = require('./Instruction'),
  end = new Instruction('restore');

const translate = (x, y, ...children) => [
  new Instruction('translate', { x, y }),
  children,
  end
];

module.exports = translate;
