# resetTransform.js

The purpose of the `resetTransform` function is to restore the canvas context back to it's original transform state. It's the equivalent of calling `setTransform(1, 0, 0, 1, 0, 0)`. See [setTransform](https://github.com/e2d/e2d/blob/master/docs/transforms/setTransform.md) for information on how setting the transform works.

It accepts a set of children which will be drawn from the default transform state.

```javascript
const normalRectangle = e2d.resetTransform(e2d.fillRect(100, 100, 200, 200) );
```

The `e2d.fillRect(100, 100, 200, 200)` instruction will be drawn normally. Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform) for more instruction on how to use the `resetTransform` function.

## Source

```javascript
import setTransform from './setTransform';

const resetTransform = (...children) => setTransform([1, 0, 0, 1, 0, 0], children);

export default resetTransform;
```