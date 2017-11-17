# resetTransform.js

The purpose of the `setTransform` function is to set the canvas context state to the resulting
transformation matrix.

It accepts a single parameter for the transform matrix and a set of children which will be drawn
from the default transform state.

```javascript
const transformedChildren = e2d.setTransform([2, 0, 0, 2, 100, 100], ...children);
```

The `children` instruction will be drawn transformed given the transofrm matrix. Please see
[mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform) for
more instruction on how to use the `setTransform` function.

## Source

```javascript
import Instruction from './Instruction';
const end = new Instruction('restore');

const setTransform = (matrix, ...children) => [
  new Instruction('setTransform', [
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5],
  ]),
  children,
  end,
];

export default setTransform;
```
