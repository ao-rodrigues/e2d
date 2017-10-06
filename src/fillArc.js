const Instruction = require('./Instruction'),
    pi2 = Math.PI * 2;

const fillArc = (...args) => {
  const [x, y, r, startAngle, endAngle, counterclockwise] = args;
  const props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };


  if (args.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (args.length >= 2) {
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("fillArc",  props);
};

module.exports = fillArc;
