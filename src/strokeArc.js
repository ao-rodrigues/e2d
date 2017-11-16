import Instruction from "./Instruction";
const pi2 = Math.PI * 2;

const fillArc = (...args) => {
  const props = [0, 0, args[0], 0, pi2, false];

  if (args.length > 3) {
    props[3] = args[3];
    props[4] = args[4];
    props[5] = !!args[5];
  }

  if (args.length >= 2) {
    props[0] = args[0];
    props[1] = args[1];
    props[2] = args[2];
  }

  return new Instruction("strokeArc", props);
};

export default fillArc;
