const Instruction = require('./Instruction');

const pointInstruction = (name) => (x, y) => new Instruction("call", {
  name,
  args: [x, y],
  count: 2
});

module.exports = pointInstruction;