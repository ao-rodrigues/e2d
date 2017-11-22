function transformOperation(transformStack, transformStackIndex, current, matrix) {
  transformStack[transformStackIndex - 6] = current[0] * matrix[0] + current[2] * matrix[1];
  transformStack[transformStackIndex - 5] = current[1] * matrix[0] + current[3] * matrix[1];
  transformStack[transformStackIndex - 4] = current[0] * matrix[2] + current[2] * matrix[3];
  transformStack[transformStackIndex - 3] = current[1] * matrix[2] + current[3] * matrix[3];
  transformStack[transformStackIndex - 2] =
    current[0] * matrix[4] + current[2] * matrix[5] + current[4];
  transformStack[transformStackIndex - 1] =
    current[1] * matrix[4] + current[3] * matrix[5] + current[5];
}

export default transform;
