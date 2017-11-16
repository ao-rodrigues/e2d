import Instruction from "./Instruction";

const clipPath = () =>
  new Instruction("call", { name: "clip", args: [], count: 0 });

export default clipPath;
