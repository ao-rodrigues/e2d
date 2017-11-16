const transformOperation = (
  transformStack,
  transformStackIndex,
  [currentA, currentB, currentC, currentD, currentE, currentF],
  [a, b, c, d, e, f],
) => {
  transformStack[transformStackIndex - 6] = currentA * a + currentC * b;
  transformStack[transformStackIndex - 5] = currentB * a + currentD * b;
  transformStack[transformStackIndex - 4] = currentA * c + currentC * d;
  transformStack[transformStackIndex - 3] = currentB * c + currentD * d;
  transformStack[transformStackIndex - 2] = currentA * e + currentC * f + currentE;
  transformStack[transformStackIndex - 1] = currentB * e + currentD * f + currentF;
};

export default transform;
