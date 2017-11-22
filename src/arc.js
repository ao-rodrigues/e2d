import Instruction from './Instruction';
import Tau from './Tau';

function arc(x, y, r, startAngle, endAngle, anticlockwise) {
  if (arguments.length > 3) {
    return new Instruction('call', {
      name: 'arc',
      args: [x, y, r, startAngle, endAngle, !!anticlockwise],
      count: 6,
    });
  }
  if (arguments.length > 1) {
    return new Instruction('call', {
      name: 'arc',
      args: [x, y, r, 0, Tau, false],
      count: 6,
    });
  }

  return new Instruction('call', {
    name: 'arc',
    args: [0, 0, x, 0, Tau, false],
    count: 6,
  });
}

export default arc;
