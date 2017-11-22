import Instruction from './Instruction';

function hitPolygon(id, points) {
  return new Instruction('hitPolygon', { id, points });
}

export default hitPolygon;
