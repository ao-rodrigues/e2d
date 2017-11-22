const rotateOperation = (transformStack, transformStackIndex, matrix, props) => {
  transformStack[transformStackIndex - 6] = matrix[0] * props.cos + matrix[2] * props.sin;
  transformStack[transformStackIndex - 5] = matrix[1] * props.cos + matrix[3] * props.sin;
  transformStack[transformStackIndex - 4] = matrix[0] * -props.sin + matrix[2] * props.cos;
  transformStack[transformStackIndex - 3] = matrix[1] * -props.sin + matrix[3] * props.cos;
  transformStack[transformStackIndex - 2] = matrix[4];
  transformStack[transformStackIndex - 1] = matrix[5];
};

export default rotateOperation;
