# Translate.js

The purpose of the `rotate` function is to rotate the current context around the point of origin by a given rotation value in radians. The `rotate` function has a single form.

It accepts one parameter to specify the magnitude of rotation, and then a set of children which will be rotated. For example:

```javascript
const rotatedRectangle = e2d.rotate( Math.PI, e2d.fillRect( 200, 200 ) );
```

The `fillRect( width, height )` instruction will be rotated 180 degrees.  Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate) for more instruction on how to use the `rotate` function.

## Source

```javascript
import Instruction from './Instruction';
const end = new Instruction('restore');

const rotate = (r, ...children) => [
  new Instruction('rotate', { cos: Math.cos(r), sin: Math.sin(r) }),
  children,
  end,
];

export default rotate;
```

Note that the rotate function is not used internally, so the resulting rotation operation actually uses the cosine and sine values in the matrix dot product to yield a modified context. It does not store the rotation value, only the resulting calculations up front.