import Instruction from "./Instruction";

const end = new Instruction("restore");

const scale = (x, y, ...children) => {
  if (typeof y !== "number") {
    children = [y].concat(children);
    y = x;
  }

  return [new Instruction("scale", { x, y }), children, end];
};

export default scale;
