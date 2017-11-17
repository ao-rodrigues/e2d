# beginPath.js

The purpose of the `beginPath` function is to describe the begining of a completely new path.

```javascript
const arcTo = e2d.beginPath();
```

Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath) for more instruction on how to use the `beginPath` function.

## Notes

It's probably better to wrap most paths inside a `e2d.path()` call instead to ensure that the paths are automatically closed. This function is exposed for convenience in case `e2d.closePath()` must be avoided.

## Source

```javascript
import emptyCall from './emptyCall';

export default emptyCall('beginPath');
```