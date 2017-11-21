# clipPath.js

The purpose of the `clipPath` function is to call the `closePath()` function directly, and close the
current subpath.

```javascript
const clippedChildren = e2d.path(
  e2d.lineTo(10, 10),
  e2d.lineTo(0, 10),
  e2d.closePath(),
  e2d.lineTo(10, 0),
  e2d.lineTo(10, -10),
);
```

Please see
[mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath) for more
instruction on how to use the `closePath` function.

## Notes

It's probably better to wrap most paths inside a `e2d.path()` call instead to ensure that the paths
are automatically closed. Try not to use this method unless there is a good reason for it. Please
see [path.js](https://github.com/e2d/e2d/blob/master/docs/path/path.md) to see how to create paths
instead of using this function manually.

## Source

```javascript
import emptyCall from './emptyCall';

export default emptyCall('closePath');
```
