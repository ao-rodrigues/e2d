import emptyCall from './emptyCall';

import Instruction from './Instruction';
import clipPath from './clipPath';
import beginPath from './beginPath';

const begin = emptyCall('save'),
  end = emptyCall('save-restore');

const clip = (path, ...children) => [begin(), beginPath(), path, clipPath(), children, end()];

export default clip;
