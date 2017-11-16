import moveTo from "./moveTo";
import lineTo from "./lineTo";

const moveToLineTo = (point, index) =>
  index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);

export default moveToLineTo;
