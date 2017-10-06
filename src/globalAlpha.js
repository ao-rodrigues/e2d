import Instruction from './Instruction';

const end = new Instruction('endGlobalAlpha');

const globalAlpha = (value, ...children) => [
  new Instruction('globalAlpha', { value }),
  children,
  end
];

export default globalAlpha;
