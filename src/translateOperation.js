const translateOperation = (
  transformStack,
  transformStackIndex,
  [a, b, c, d, e, f],
  { x, y }
) => {
  transformStack[transformStackIndex - 6] = a;
  transformStack[transformStackIndex - 5] = b;
  transformStack[transformStackIndex - 4] = c;
  transformStack[transformStackIndex - 3] = d;
  transformStack[transformStackIndex - 2] = e + a * x + c * y;
  transformStack[transformStackIndex - 1] = f + b * x + d * y;
};

export default translateOperation;
