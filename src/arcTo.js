import Instruction from './Instruction';

const arcTo = (x1, y1, x2, y2, r) =>
  new Instruction('call', {
    name: 'arcTo',
    args: [x1, y1, x2, y2, r],
    count: 5,
  });

export default arcTo;
