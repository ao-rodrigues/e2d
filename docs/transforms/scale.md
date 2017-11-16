# Translate.js

The purpose of the `scale` function is to change the size and shape current origin to resize the drawing instructions over the `x` axis horizontally and the `y` axis vertically. The `scale` function has two forms:

```javascript
const end = new Instruction('restore');

const scale = (x, y, ...children) => {
  if (typeof y !== 'number') {
    children = [y].concat(children);
    y = x;
  }

  return [new Instruction('scale', { x, y }), children, end];
};
```

It accepts one or two parameters to specify the size of the scale in the `x` and `y` directions, and then a set of children which will be scaled. For example:

```javascript
const simpleScaledImage = e2d.scale( 2, e2d.drawImage( img ) );
const customScaledImage = e2d.scale( 1.5, 2, e2d.drawImage( img ) );
```

The `drawImage( img )` instruction will be scaled according to the provided size. Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale) for more instruction on how to use the `scale` function.
