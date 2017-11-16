import Instruction from "./Instruction";
const end = new Instruction("restore");

const translate = (x, y, ...children) => [
  new Instruction("translate", { x, y }),
  children,
  end
];

export default translate;
