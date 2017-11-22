const scaleOperation = (transformStack, transformStackIndex, matrix, props) => {
  transformStack[transformStackIndex - 6] = matrix[0] * props.x;
  transformStack[transformStackIndex - 5] = matrix[1] * props.x;
  transformStack[transformStackIndex - 4] = matrix[2] * props.y;
  transformStack[transformStackIndex - 3] = matrix[3] * props.y;
  transformStack[transformStackIndex - 2] = matrix[4];
  transformStack[transformStackIndex - 1] = matrix[5];
};

export default scaleOperation;
