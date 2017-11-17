# arc.js

The purpose of the `arcTo` function is to describe an arc starting at the last endPoint in the
current subpath, with radius `r`, and is tangent to the line segment created by the points `[x1,
y1]` and `[x2, y2]`. It has three forms that assume a set of default parameters.

```javascript
const arcTo = e2d.arcTo(x1, y1, x2, y2, r);
```

Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arcTo)
for more instruction on how to use the `arcTo` function.

## Source

```javascript
import Instruction from './Instruction';

const arcTo = (x1, y1, x2, y2, r) =>
  new Instruction('call', {
    name: 'arcTo',
    args: [x1, y1, x2, y2, r],
    count: 5,
  });

export default arcTo;
```
