import Tau from './Tau';

function createRegularPolygon(radius = 0, position = [0, 0], sides = 3) {
  const polygon = [];
  const factor = Tau / sides;
  let value = 0;
  for (let i = 0; i < sides; i++) {
    polygon.push([position[0] + radius * Math.cos(value), position[1] + radius * Math.sin(value)]);
    value += factor;
  }
  return polygon;
}

export default createRegularPolygon;
