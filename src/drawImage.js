import Instruction from "./Instruction";

const drawImage = (...args) => {
  if (args.length >= 9) {
    return new Instruction("call", {
      name: "drawImage",
      args,
      count: 9
    });
  }

  const [img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight] = args;

  if (args.length >= 5) {
    return new Instruction("call", {
      name: "drawImage",
      args: [img, sx, sy, sWidth, sHeight],
      count: 5
    });
  }

  return new Instruction("call", {
    name: "drawImage",
    args: args.length >= 3 ? [img, sx, sy] : [img, 0, 0],
    count: 3
  });
};

export default drawImage;
