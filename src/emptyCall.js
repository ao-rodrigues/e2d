import Instruction from "./Instruction";

const emptyCall = ( name ) => () => new Instruction( "call", { name, args: [], count: 0 } );
export default emptyCall;
