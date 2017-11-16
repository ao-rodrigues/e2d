import Instruction from './Instruction';

const hitRegion = (id, path, fillRule) => {
  if (Array.isArray(path)) {
    return new Instruction('hitRegion', { id, path, fillRule });
  }

  if (path && path.constructor === String) {
    fillRule = path;
    return new Instruction('hitRegion', { id, path: null, fillRule });
  }

  return new Instruction('hitRegion', { id, path: null, fillRule: null });
};

export default hitRegion;
