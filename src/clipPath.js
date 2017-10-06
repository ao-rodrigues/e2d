const Instruction = require('./Instruction');

const clipPath = () => new Instruction('call', { name: 'clip', args: [], count: 0 });

module.exports = clipPath;
