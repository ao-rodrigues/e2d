import Instruction from "./Instruction";

const hitPolygon = (id, points) =>
  new Instruction("hitPolygon", { id, points });

export default hitPolygon;
