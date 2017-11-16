const rotateOperation = (transformStack, transformStackIndex, [a, b, c, d, e, f], { sin, cos }) => {
  transformStack[transformStackIndex - 6] = a * cos + c * sin;
  transformStack[transformStackIndex - 5] = b * cos + d * sin;
  transformStack[transformStackIndex - 4] = a * -sin + c * cos;
  transformStack[transformStackIndex - 3] = b * -sin + d * cos;
  transformStack[transformStackIndex - 2] = e;
  transformStack[transformStackIndex - 1] = f;
};

export default rotateOperation;
