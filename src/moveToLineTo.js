import moveTo from './moveTo';
import lineTo from './lineTo';

function moveToLineTo(point, index) {
  return index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);
}

export default moveToLineTo;
