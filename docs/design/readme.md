## Design Philosophy

The design philosophy behind `e2d` was tweaked and developed over the course of two years of
research into how the `CanvasRenderingContext2D.prototype` works. As the developer of this project I
wanted to do the following things:

1. Mirror the Canvas API
1. Change Function Names where appropriate (ex: setLineDash => lineDash.js)
1. Change Meaning of Functions where appropriate (ex: clip.js, path.js)
1. Polyfill useful functions (ellipse, fillArc, strokeArc...)
1. Add support for mouse, keyboard, touch (coming soon!) and hitDetection, and node.js (soon!)
1. Learn and grow in my understanding of how JS works
1. Put forth something developers can actually use in their projects

## vStack Importance

The `vStack` is an idea that allows a developer to make the smallest number of changes to a
`CanvasRendererContext2D` object when dealing with drawing multiple complex things. It is analagous
to the way that a `virtual-dom` works, but lifecycle of canvas instructions is _very_ different.

For instance, when drawing a polygon, it's often beneficial to use the `ctx.save()` and
`ctx.restore()` fuctions to make some sense of the imperative API provided by the context. However,
`save` and `restore` will copy and restore the entire canvas context state, which has the potential
to be undesirable. Instead, an alternative could be to restore a `fillStyle` by simply returning it
to it's former state. For example:

```javascript
const redSquare = (ctx, x, y, width, height) => {
  const previousStyle = ctx.fillStyle;
  ctx.fillStyle = 'red';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = previousStyle;
};
```

Indeed, this is the _fastest_ way to restore a `fillStyle` after setting it. This is precisely the
functionality encapsulated by the `e2d` library. However, the problem becomes more complex with you
mix and match functions that rely on context state together.

```javascript
const drawShip = (ctx, ship, x, y) => {
  ctx.translate(x, y);
  //what happens inside here?
  doSomethingElse(ctx);
  ctx.drawImage(ship, 0, 0, ship.width, ship.height);
};

export default drawShip;
```

In the large majority of cases, you know exactly what happens in your functions, because you
designed them yourself. In the case when you're consuming someone else's library, the problem
becomes more difficult. What exactly is this function doing with your canvas context? Can you
garuntee that the changes made to the context within the `doSomethingElse` function won't have side
effects applied to your canvas context? This is something you must always consider as a canvas
developer. Of course, one way to solve the problem is to do something as follows:

```javascript
import doSomethingElse from 'do-something-else';

const drawShip = (ctx, ship, x, y) => {
  ctx.translate(x, y);
  ctx.save(); //push the whole state of the context
  doSomethingElse(ctx);
  ctx.restore(); //pop the whole state of the context
  ctx.drawImage(ship, 0, 0, ship.width, ship.height);
};

export default drawShip;
```

As a result, we are better protected from function side effects at the cost of pushing and popping
the whole canvas state. However, this still doesn't exactly solve the problem, because `pushing` and
`popping` canvas states itself is a **mutable part of the context!** If the developer of
`doSomethingElse` forgets to call `save` or `restore` internally, then this will reuslt in an
unexpected context state. This is often _very_ undesirable and will lead to impossible to determine
side effects. To this regard, e2d solves the problem with a bit more elegance by exposing an API
that naturally cleans up after itself in the process of rendering.

```javascript
import e2d from 'e2d';
import doSomethingElse from 'do-something-else';

const drawShip = (ship, x, y) => (
  <translate x={x} y={y}>
    Assume that doSomethingElse returns an e2d tree.
    {doSomethingElse()}
    <drawImage img={ship} />
  </translate>
);

export default drawShip;
```

What does this accomplish?

1. It's a stateless component, devoid of opinion based on state. (Yay!)
1. View logic is decoupled from draw logic. (Yay!)
1. Game logic itself is decoupled from view logic. (Yay!)
1. Garunteed safety from side effects. (Yay!)
1. No save/restore needed. (Yay!)
1. Bonus: `e2dx` has a nice XML syntax that looks like JSX (If you like that sort of thing, yay!)

This is better if you need to trade your precious time as a developer for easier and safer results
at the cost of a small performance hit. `e2d` is a relatively small library and because every
kilobyte counts when bundling your application. In that regard, it's always something to considder.

## Stackable State

One of the more elegant parts about e2d is the ability to stack immutable states on top of each
other. Take the following example with some stacked translates:

```javascript
const transformedRectangle = (
  <translate x={100} y={100}>
    <translate x={100} y={100}>
      <fillRect x={0} y={0} width={100} height={100} />
    </translate>
  </translate>
);
```

Ultimately, the two translates will stack on top of each other, resuling in the rectangle being
filled at `[200, 200]`. This is desired behavior. It's even better when dealing with complex radial
paths. For example:

```javascript
const equilateralTriangle = <path>
  Create a path and rotate the context so that the triangle is rotated upward.
  <rotate angle={-Math.PI / 2}>
    Start at point 0.
    <rotate angle={0}><moveTo x={1} y={0}></rotate>
    Then rotate to the next point and make a line to it.
    <rotate angle={Math.PI * 2 / 3}><lineTo x={1} y={0}></rotate>
    Finally rotate to the last point and make a line to it.
    <rotate angle={Math.PI * 4 / 3}><lineTo x={1} y={0}></rotate>
  </rotate>
  Close the path.
</path>;
```

This offsets the calculation of the `[x, y]` coordinates of your triangle onto the transform stack.
Want to make it thirty times bigger? Just scale it.

```javascript
const thirtyTimesBigger = <scale value={30}>{equilateralTriangle}</scale>;
```

Want to take that larger triangle and move it to the center of the screen? No problem!

```javascript
const centeredTriangle = (
  <translate x={width * 0.5} y={height * 0.5}>
    {thirtyTimesBigger}
  </translate>
);
```

The bigger concept here is instruction reusability, and to the extent that instructions get re-used,
that will be the extent to which your productivity will increase as a canvas developer.

## Conclusion

e2d has plenty of positives and negatives, and may not fit into your development stack. However,
developers who find `React` palatable will find themselves at home developing with `e2d`, with the
exception of the fact that there is no component lifecycle bundled with this library. Solving the
problem of canvas application structure is out of the scope of this project.
