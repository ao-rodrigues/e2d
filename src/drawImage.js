import Instruction from './Instruction';

function drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length >= 9) {
    return new Instruction('call', {
      name: 'drawImage',
      args: [img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight],
      count: 9,
    });
  }

  if (arguments.length >= 5) {
    return new Instruction('call', {
      name: 'drawImage',
      args: [img, sx, sy, sWidth, sHeight],
      count: 5,
    });
  }

  return new Instruction('call', {
    name: 'drawImage',
    args: arguments.length >= 3 ? [img, sx, sy] : [img, 0, 0],
    count: 3,
  });
}

export default drawImage;
