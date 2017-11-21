# clip.js

The purpose of the `clip` function is to describe a cutout region to draw to the canvas.

```javascript
const clippedChildren = e2d.clip(clipPath, ...children);
```

Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip) for
more instruction on how to use the `clip` function.

## Notes

It's probably better to wrap most paths inside a `e2d.clip(e2d.path(), ...children)` call instead to
ensure that the paths are automatically closed. This function is the only e2d function that requires
a call to `ctx.save()` and `ctx.restore()`. This is because applying a clipping path is a one-way
ticket, and the only way to restore a clipping path is to `save` and `restore` a canvas completely.

## Source

```javascript
import emptyCall from './emptyCall';

import Instruction from './Instruction';
import clipPath from './clipPath';
import beginPath from './beginPath';

const begin = emptyCall('save'),
  end = emptyCall('save-restore');

const clip = (path, ...children) => [begin(), beginPath(), path, clipPath(), children, end()];

export default clip;
```
