const Instruction = require('./Instruction');

const hitRegion = (id, points) => new Instruction('hitRegion', { id, points });

module.exports = hitRegion;
