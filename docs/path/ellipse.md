# arc.js

The purpose of the `ellipse` function is to describe ellipses with a center point, a two radii, and
a given range of angles. It has five forms that assume a set of default parameters.

```javascript
const simpleEllipse = e2d.arc(radiusX, radiusY);
const ellipseWithPoint = e2d.arc(x, y, radiusX, radiusY);
const ellipseWithRotation = e2d.arc(x, y, radiusX, radiusY, rotation);
const ellipseWithRange = e2d.arc(x, y, radiusX, radiusY, rotation, beginAngle, endAngle);
const ellipseAnticlockwise = e2d.arc(
  x,
  y,
  radiusX,
  radiusY,
  rotation,
  beginAngle,
  endAngle,
  anticlockwise,
);
```

Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ellipse)
for more instruction on how to use the `arc` function.

## Source

```javascript
import Instruction from './Instruction';
import Pi2 from './Pi2';

const ellipse = (...args) => {
  const [x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise] = args;

  return new Instruction('call', {
    name: 'ellipse',
    args:
      args.length > 5
        ? args
        : args.length > 4
          ? [x, y, radiusX, radiusY, rotation, startAngle, false]
          : args.length > 2 ? [x, y, radiusX, radiusY, 0, pi2, false] : [0, 0, x, y, 0, Pi2, false],
    count: 7,
  });
};

export default ellipse;
```
