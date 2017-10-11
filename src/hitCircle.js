import Instruction from "./Instruction";

const hitCircle = ( id, ...args ) => new Instruction( "hitCircle", {
  id,
  points: args.length === 1 ? [ 0, 0, args[ 0 ] ] : [ args[ 0 ], args[ 1 ], args[ 2 ] ]
} );

export default hitCircle;
