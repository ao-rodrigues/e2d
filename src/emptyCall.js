import Instruction from './Instruction';

const emptyCall = name =>
  function() {
    return new Instruction('call', { name, args: [], count: 0 });
  };

export default emptyCall;
