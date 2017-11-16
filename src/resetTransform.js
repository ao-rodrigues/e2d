import setTransform from './setTransform';

const resetTransform = (...children) => setTransform([1, 0, 0, 1, 0, 0], children);

export default resetTransform;
