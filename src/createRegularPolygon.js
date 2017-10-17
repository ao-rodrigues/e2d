import Pi2 from "./Pi2";
const createRegularPolygon = ( radius = 0, position = [ 0, 0 ], sides = 3 ) => {
  const polygon = [];
  const factor = Pi2 / sides;
  for ( let i = 0; i < sides; i++ ) {
    polygon.push( [
      position[ 0 ] + radius * Math.cos( factor * i ),
      position[ 1 ] + radius * Math.sin( factor * i )
    ] );
  }
  return polygon;
};

export default createRegularPolygon;
