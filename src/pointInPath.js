import call from './call';
const empty = [];
const concat = empty.concat;

export default ([x, y], instructions) => {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.canvas.width = 1;
  ctx.canvas.height = 1;

  for (let i = 0; i < instructions.length; i++) {
    while (instructions[i] && instructions[i].constructor === Array) {
      instructions = concat.apply(empty, instructions);
    }
    if (!instructions[i]) {
      continue;
    }
    call(ctx, instructions[i]);
  }

  return ctx.isPointInPath(x, y);
};
