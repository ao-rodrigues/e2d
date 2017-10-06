const Instruction = require('./Instruction'),
  end = new Instruction('restore');

const transform = (values, ...children) => {
  return [
    new Instruction('transform', [
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5]
    ]),
    children,
    end
  ];
};


module.exports = transform;
