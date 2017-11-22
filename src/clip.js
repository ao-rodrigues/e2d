import emptyCall from './emptyCall';

import Instruction from './Instruction';
import clipPath from './clipPath';
import beginPath from './beginPath';

const begin = emptyCall('save')(),
  beginPathInstruction = beginPath(),
  clipPathInstruction = clipPath(),
  end = emptyCall('restore')();

function clip(path, ...children) {
  return [begin, beginPathInstruction, path, clipPathInstruction, children, end];
}

export default clip;
