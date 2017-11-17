# transform.js

The purpose of the `transform` function is to transform the current state of the canvas contex relative to the current canvas context state. This results in a new state.

It accepts a single parameter for the transform matrix and a set of children which will be drawn from the default transform state.

```javascript
const transformedChildren = e2d.transform([2, 0, 0, 2, 100, 100], ...children);
```

The `children` instruction will be drawn transformed given the transofrm matrix relative to the current context transform state. Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform) for more instruction on how to use the `transform` function.

## Source

```javascript
import Instruction from './Instruction';
const end = new Instruction('restore');

const setTransform = (matrix, ...children) => [
  new Instruction('transform', [
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