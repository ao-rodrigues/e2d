const Instruction = require('./Instruction');

const textInstruction = (name) => (...args) => new Instruction('call', {
  name,
  args: args.length >= 3 ? args : [args[0], 0, 0],
  count: args.length >= 4 ? 4 : 3
});

module.exports = textInstruction;