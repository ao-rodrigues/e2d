# arc.js

The purpose of the `arc` function is to describe arcs with a center point, a radius, and a given range of angles. It has three forms that assume a set of default parameters.

```javascript
const simpleArc = e2d.arc(radius);
const arcWithPoint = e2d.arc(x, y, radius);
const arcWithPointAndRange = e2d.arc(x, y, radius, beginAngle, endAngle);
```

Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc) for more instruction on how to use the `arc` function.

## Source

```javascript
import Instruction from './Instruction';
import Pi2 from './Pi2';

const arc = (...args) => {
  if (args.length > 3) {
    return new Instruction('call', { name: 'arc', args, count: 6 });
  }
  if (args.length > 1) {
    return new Instruction('call', {
      name: 'arc',
      args: [args[0], args[1], args[2], 0, Pi2, false],
      count: 6,
    });
  }

  return new Instruction('call', {
    name: 'arc',
    args: [0, 0, args[0], 0, Pi2, false],
    count: 6,
  });
};

export default arc;
```
