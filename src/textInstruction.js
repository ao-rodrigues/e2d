import Instruction from './Instruction';

const textInstruction = name =>
  function(text, x, y, maxWidth) {
    return new Instruction('call', {
      name,
      args:
        arguments.length > 3
          ? [text, x, y, maxWidth]
          : arguments.length >= 1 ? [text, x, y] : [text, 0, 0],
      count: arguments.length > 3 ? 4 : 3,
    });
  };

export default textInstruction;
