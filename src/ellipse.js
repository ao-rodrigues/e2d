import Instruction from './Instruction';
import Tau from './Tau';

function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
  return new Instruction('call', {
    name: 'ellipse',
    args:
      arguments.length >= 6
        ? [x, y, radiusX, radiusY, rotation, startAngle, endAngle, !!anticlockwise]
        : arguments.length === 5
          ? [x, y, radiusX, radiusY, rotation, 0, Tau, false]
          : arguments.length >= 3
            ? [x, y, radiusX, radiusY, 0, 0, Tau, false]
            : [0, 0, x, y, 0, Tau, false],
    count: 7,
  });
}

export default ellipse;
