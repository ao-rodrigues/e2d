import Instruction from './Instruction';

function hitRegion(id, fillRule = null) {
  return new Instruction('hitRegion', { id, fillRule });
}

export default hitRegion;
