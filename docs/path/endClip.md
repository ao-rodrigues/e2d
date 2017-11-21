# clipPath.js

The purpose of the `endClip` function is to call the `restore()` function directly, and close the
current subpath.

Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip) for
more instruction on how to use the `clip` function.

## Notes

It's probably better to wrap most paths inside a `e2d.clip()` call instead to ensure that the paths
are automatically clipped. Try not to use this method unless there is a good reason for it. Please
see [path.js](https://github.com/e2d/e2d/blob/master/docs/path/path.md) to see how to create paths
instead of using this function manually.

## Source

```javascript
import emptyCall from './emptyCall';

export default emptyCall('restore');
```
