import beginPath from './beginPath';
import closePath from './closePath';

function path(...children) {
  return [beginPath(), children, closePath()];
}

export default path;
