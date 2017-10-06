const emptyCall = require('./emptyCall');

const Instruction = require('./Instruction');

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

module.exports = clip;
