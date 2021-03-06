import Instruction from './Instruction';
const end = new Instruction('restore');

const setTransform = (matrix, ...children) => [
  new Instruction('setTransform', [
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5],
  ]),
  children,
  end,
];

export default setTransform;
