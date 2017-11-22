const skewXOperation = (transformStack, transformStackIndex, matrix, props) => {
  transformStack[transformStackIndex - 6] = matrix[0];
  transformStack[transformStackIndex - 5] = matrix[1];
  transformStack[transformStackIndex - 4] = matrix[0] * props.x + matrix[2];
  transformStack[transformStackIndex - 3] = matrix[1] * props.x + matrix[3];
  transformStack[transformStackIndex - 2] = matrix[4];
  transformStack[transformStackIndex - 1] = matrix[5];
};

export default skewXOperation;
