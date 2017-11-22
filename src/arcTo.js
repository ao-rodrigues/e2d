import Instruction from './Instruction';

function arcTo(x1, y1, x2, y2, r) {
  return new Instruction('call', {
    name: 'arcTo',
    args: [x1, y1, x2, y2, r],
    count: 5,
  });
}
export default arcTo;
