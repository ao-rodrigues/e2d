import Instruction from './Instruction';
import Pi2 from './Pi2';

const arc = (...args) => {
  if (args.length > 3) {
    return new Instruction('call', { name: 'arc', args, count: 6 });
  }
  if (args.length > 1) {
    return new Instruction('call', {
      name: 'arc',
      args: [args[0], args[1], args[2], 0, Pi2, false],
      count: 6,
    });
  }

  return new Instruction('call', {
    name: 'arc',
    args: [0, 0, args[0], 0, Pi2, false],
    count: 6,
  });
};

export default arc;
