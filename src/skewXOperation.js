const skewXOperation = ( transformStack, transformStackIndex, [ a, b, c, d, e, f ], { x } ) => {
  transformStack[ transformStackIndex - 6 ] = a;
  transformStack[ transformStackIndex - 5 ] = b;
  transformStack[ transformStackIndex - 4 ] = a * x + c;
  transformStack[ transformStackIndex - 3 ] = b * x + d;
  transformStack[ transformStackIndex - 2 ] = e;
  transformStack[ transformStackIndex - 1 ] = f;
};

export default skewXOperation;
