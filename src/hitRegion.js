import Instruction from './Instruction';

const hitRegion = (id, points) => new Instruction('hitRegion', { id, points });

export default hitRegion;