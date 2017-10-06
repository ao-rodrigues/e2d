const Instruction = require('./Instruction');

const stackable = (stack) => {
  const end = new Instruction('pop', { stack });
  const stackableFunc = (value, ...children) => [
    new Instruction('push', { stack, value }),
    ...children,
    end
  ];

  return stackableFunc;
};
module.exports = stackable;