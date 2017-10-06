const Instruction = require('./Instruction');

const quadraticCurveTo = (cpx, cpy, x, y) => new Instruction('call', { name: 'quadraticCurveTo', args: [cpx, cpy, x, y], count: 4 });

module.exports = quadraticCurveTo;