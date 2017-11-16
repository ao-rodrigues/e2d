import Instruction from './Instruction';

const rectInstruction = name => (...args) =>
  new Instruction('call', {
    name,
    args: args.length > 2 ? args : [0, 0, args[0], args[1]],
    count: 4,
  });

export default rectInstruction;
