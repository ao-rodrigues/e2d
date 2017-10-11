let det = 0;
const invertMatrix = ( [ a, b, c, d, e, f ] ) => (
  det = 1 / ( a * d - c * b ),
  [
    d * det,
    -c * det,
    -b * det,
    a * det,
    ( b * f - e * d ) * det,
    ( e * b - a * f ) * det
  ]
);
export default invertMatrix;
