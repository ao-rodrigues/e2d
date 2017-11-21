# clipPath.js

The purpose of the `clipPath` function is to call the `clip()` function directly.

```javascript
const clippedChildren = e2d.clip(clipPath, ...children);
```

Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip) for
more instruction on how to use the `clip` function.

## Notes

It's probably better to wrap most paths inside a `e2d.clip(e2d.path(), ...children)` call instead to
ensure that the paths are automatically closed. Please see
[clip.js](https://github.com/e2d/e2d/blob/master/docs/path/clip.md) to see how to clip paths instead
of using this function manually.

## Source

```javascript
import emptyCall from './emptyCall';

const clipPath = emptyCall('clip');

export default clipPath;
```
