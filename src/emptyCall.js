const Instruction = require('./Instruction');

const emptyCall = (name) => () => new Instruction('call', { name, args: [], count: 0 });

module.exports = emptyCall;