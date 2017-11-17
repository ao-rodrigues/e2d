# bezierCurveTo.js

The purpose of the `bezierCurveTo` function is to describe an curve starting at the end of the
current subPath, and then follows along the trajectory of the shape of a cubic bezierCurve described
by points `[cp1x, cp1y]` and `[cp2x, cp2y]`. Please see
[Higher-order curves](https://en.wikipedia.org/wiki/Bézier_curve#Higher-order_curves) [link to
wikipedia] to see how a cubic bezier curve is constructed visually.

```javascript
const bezierCurveTo = e2d.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
```

Please see
[mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo) for
more instruction on how to use the `bezierCurveTo` function.

## Source

```javascript
import Instruction from './Instruction';

const bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) =>
  new Instruction('call', {
    name: 'bezierCurveTo',
    args: [cp1x, cp1y, cp2x, cp2y, x, y],
    count: 5,
  });

export default bezierCurveTo;
```
