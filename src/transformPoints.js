const transformPoints = (points, matrix) => {
  const result = [];
  let x, y;

  for(let i = 0; i < points.length; i++) {
    [x, y] = points[i];
    result.push([
      matrix[0] * x + matrix[2] * y + matrix[4],
      matrix[1] * x + matrix[3] * y + matrix[5]
    ]);
  }
  return result;
};

module.exports = transformPoints;
