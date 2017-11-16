const skewYOperation = (transformStack, transformStackIndex, [a, b, c, d, e, f], { y }) => {
  transformStack[transformStackIndex - 6] = c * y + a;
  transformStack[transformStackIndex - 5] = d * y + b;
  transformStack[transformStackIndex - 4] = c;
  transformStack[transformStackIndex - 3] = d;
  transformStack[transformStackIndex - 2] = e;
  transformStack[transformStackIndex - 1] = f;
};

export default skewYOperation;
