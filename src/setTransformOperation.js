const setTransformOperation =  ( transformStack, transformStackIndex, [ a, b, c, d, e, f ] ) => {
  transformStack[ transformStackIndex - 6 ] = a;
  transformStack[ transformStackIndex - 5 ] = b;
  transformStack[ transformStackIndex - 4 ] = c;
  transformStack[ transformStackIndex - 3 ] = d;
  transformStack[ transformStackIndex - 2 ] = e;
  transformStack[ transformStackIndex - 1 ] = f;
};

export default setTransformOperation;
