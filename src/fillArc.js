

let Instruction = require('./Instruction'),
    pi2 = Math.PI * 2;

let fillArc = (x, y, r, startAngle, endAngle, counterclockwise) => {
  let props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };


  if (arguments.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (arguments.length > 1){
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("fillArc",  props);
};

module.exports = fillArc;
