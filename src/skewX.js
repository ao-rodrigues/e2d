import Instruction from "./Instruction";
const end = new Instruction("restore");

const skewX = (x, ...children) => [
  new Instruction("skewX", { x: Math.tan(x) }),
  children,
  end
];

export default skewX;
