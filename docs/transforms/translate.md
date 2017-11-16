# Translate.js

The purpose of the `translate` function is to move current origin to a new location along the `x` axis horizontally and the `y` axis vertically. The `translate` function has a single form.

It accepts two parameters to specify the point of translation, and then a set of children which will be translated. For example:

```javascript
const movedRectangle = e2d.translate( 100, 100, e2d.fillRect( 200, 200 ) );
```

The `fillRect( width, height )` instruction will be translated out to point `[100, 100]`.  Please see [mdn](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/translate) for more instruction on how to use the `translate` function.

## Source

```javascript
const end = new Instruction('restore');

const translate = (x, y, ...children) => [
  new Instruction('translate', { x, y }),
  children,
  end
];

export default translate;
```