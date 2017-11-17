import Instruction from './Instruction';

const hitRegion = (id, fillRule = null) => new Instruction('hitRegion', { id, fillRule });

export default hitRegion;
