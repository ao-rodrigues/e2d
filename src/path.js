import beginPath from './beginPath';
import closePath from './closePath';

const path = (...children) => [beginPath(), children, closePath()];

export default path;
