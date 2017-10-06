import emptyCall from './emptyCall';

import Instruction from './Instruction';

const begin = [emptyCall('save'), emptyCall('beginPath')],
  performClip = emptyCall('clip'),
  end = emptyCall('restore');

const clip = (path, ...children) => [
  begin,
  path,
  performClip,
  children,
  end
];

export default clip;