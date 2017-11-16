import Instruction from "./Instruction";

const pointInstruction = name => (x, y) =>
  new Instruction("call", {
    name,
    args: [x, y],
    count: 2
  });

export default pointInstruction;
