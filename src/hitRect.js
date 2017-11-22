import Instruction from './Instruction';

function hitRect(id, x, y, width, height) {
  if (arguments.length <= 3) {
    width = x;
    height = y;
    x = 0;
    y = 0;
  }
  return new Instruction('hitRect', {
    id,
    points: [[x, y], [x + width, y + height]],
  });
}

export default hitRect;
