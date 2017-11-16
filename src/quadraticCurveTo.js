import Instruction from './Instruction';

const quadraticCurveTo = (cpx, cpy, x, y) =>
  new Instruction('call', {
    name: 'quadraticCurveTo',
    args: [cpx, cpy, x, y],
    count: 4,
  });

export default quadraticCurveTo;
