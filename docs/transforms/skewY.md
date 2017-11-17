# skewY.js

This function is provided by the library to provide a more complete set of transforms for canvas
manipulation. The purpose of the `skewY` function is to skew the current context around the point of
origin in the `y` direction by a given rotation value in radians. The `skewY` function has a single
form.

It accepts one parameter to specify the magnitude of rotation, and then a set of children which will
be skewed. For example:

```javascript
const skewedRectangle = e2d.skewY(Math.PI / 2, e2d.fillRect(200, 200));
```

The `fillRect( width, height )` instruction will be skewed 90 degrees in the `y` direction. Please
see [mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skewY) for more
information about how the DOM skews div elements.

## Source

```javascript
import Instruction from './Instruction';
const end = new Instruction('restore');

const skewY = (y, ...children) => [new Instruction('skewY', { y: Math.tan(y) }), children, end];

export default skewY;
```

Note that there is no `skewY` function on the `CanvasRenderingContext2D.prototype` and it is not
used internally, so the resulting skew operation actually uses the `tan` value in the matrix dot
product to yield a modified context. It does not store the rotation value, only the resulting
calculations up front.
