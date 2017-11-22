import Instruction from './Instruction';
const end = new Instruction('restore');

function translate(x, y, ...children) {
  return [new Instruction('translate', { x, y }), children, end];
}

export default translate;
