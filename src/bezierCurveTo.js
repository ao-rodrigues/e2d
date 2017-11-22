import Instruction from './Instruction';

function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
  return new Instruction('call', {
    name: 'bezierCurveTo',
    args: [cp1x, cp1y, cp2x, cp2y, x, y],
    count: 5,
  });
}

export default bezierCurveTo;
