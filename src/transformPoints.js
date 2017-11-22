function transformPoints(points, [a, b, c, d, e, f]) {
  const result = [];
  let x, y;

  for (const point of points) {
    [x, y] = point;
    result.push([a * x + c * y + e, b * x + d * y + f]);
  }

  return result;
}

export default transformPoints;
