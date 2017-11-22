import Instruction from './Instruction';
import Tau from './Tau';

function fillArc(x, y, r, startAngle, endAngle, anticlockwise) {
  const props = [0, 0, x, 0, Tau, false];

  if (arguments.length > 3) {
    props[3] = startAngle;
    props[4] = endAngle;
    props[5] = !!anticlockwise;
  }

  if (arguments.length >= 2) {
    props[0] = x;
    props[1] = y;
    props[2] = r;
  }

  return new Instruction('fillArc', props);
}

export default fillArc;
