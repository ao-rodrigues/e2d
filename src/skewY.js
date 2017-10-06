import Instruction from './Instruction';
const end = new Instruction('restore');

const skewY = (y, ...children) => [
  new Instruction('skewY', { y: Math.tan(y) }),
  children,
  end
];

export default skewY;
