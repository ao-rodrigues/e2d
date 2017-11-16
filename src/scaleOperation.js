const scaleOperation = (
  transformStack,
  transformStackIndex,
  [a, b, c, d, e, f],
  { x, y }
) => {
  transformStack[transformStackIndex - 6] = a * x;
  transformStack[transformStackIndex - 5] = b * x;
  transformStack[transformStackIndex - 4] = c * y;
  transformStack[transformStackIndex - 3] = d * y;
  transformStack[transformStackIndex - 2] = e;
  transformStack[transformStackIndex - 1] = f;
};

export default scaleOperation;
