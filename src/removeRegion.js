import Instruction from "./Instruction";

const removeRegion = id => new Instruction("removeRegion", { id });

export default removeRegion;
