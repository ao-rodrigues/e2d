import Instruction from './Instruction';

function hitCircle(id, x, y, r) {
  return new Instruction('hitCircle', {
    id,
    points: arguments.length === 1 ? [0, 0, x] : [x, y, r],
  });
}

export default hitCircle;
