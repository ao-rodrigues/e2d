import Instruction from  "./Instruction";
const pi2 = Math.PI * 2;

const ellipse = ( ...args ) => {
  const [ x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise ] = args;

  return new Instruction( "call", {
    name: "ellipse",
    args: args.length > 5 ? args :
      args.length > 4 ? [ x, y, radiusX, radiusY, rotation, startAngle, false ] :
      args.length > 2 ? [ x, y, radiusX, radiusY, 0, pi2, false ] :
      [ 0, 0, x, y, 0, pi2, false ],
    count: 7
  } );
};

export default ellipse;
