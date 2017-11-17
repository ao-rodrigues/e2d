
## Design Philosophy

The design philosophy behind `e2d` was tweaked and developed over the course of two years of research into how the `CanvasContext2D.prototype` works. As the developer of this project I wanted to do the following things:

1. Mirror the Canvas API
1. Change Function Names where appropriate (ex: setLineDash => lineDash.js)
1. Change Meaning of Functions where appropriate (ex: clip.js, path.js)
1. Polyfill useful functions (ellipse, fillArc, strokeArc...)
1. Add support for mouse, keyboard, touch (coming soon!) and hitDetection, node.js (coming soon!)
1. Learn and grow in my understanding of how JS works
1. Put forth something developers can actually use

## vStack Importance

The `vStack` is an idea that allows a developer to make the smallest number of changes to a `CanvasRendererContext2D` object when dealing with drawing multiple complex things. It is analagous to the way that a `virtual-dom` works, but lifecycle of canvas instructions is *very* different.

For instance, when drawing a polygon, it's often beneficial to use the `ctx.save()` and `ctx.restore()` fuctions to make some sense of the imperative API provided by the context. However, `save` and `restore` will copy and restore the entire canvas context state, which has the potential to be undesirable. Instead, an alternative could be to restore a `fillStyle` by simply returning it to it's former value. For example:

```javascript
const redSquare = (ctx, x, y, width, height) => {
  const previousStyle = ctx.fillStyle;
  ctx.fillStyle = 'red';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = previousStyle;
};
```

Indeed, this is the *fastest* way to restore a `fillStyle` after setting it. This is precisely the functionality encapsulated by the `e2d` library. However, the problem becomes more complex with you mix and match functions that rely on context state together.

```javascript
const drawShip = (ctx, ship, x, y) => {
  ctx.translate(x, y);
  //what happens inside here?
  doSomethingElse(ctx);
  ctx.drawImage(ship, 0, 0, ship.width, ship.height);
};

export default drawShip;
```

In the large majority of cases, you know exactly what happens in your functions, because you designed them yourself. In the case when you're consuming someone else's library, the problem becomes more difficult. What exactly is this function doing with your canvas context? Can you garuntee that the changes made to the context within the `doSomethingElse` function won't have side effects applied to your canvas context? This is something you must always considder as a canvas developer. Of course, one way to solve the problem is to do something as follows:

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

Now we are more safe from function side effects at the cost of pushing and popping the whole canvas state. However, this still doesn't exactly solve the problem, because `pushing` and `popping` canvas states itself **is a mutable part of the canvas**. IF the developer of `doSomethinElse` forgets to call `save` or `restore` internally, then this will reuslt in an unexpected context state. This is *very* undesirable. To this regard, E2D solves the problem with a bit more elegance by exposing an API that naturally cleans itself up when rendering the tree.

```javascript
import e2d from 'e2d';
import doSomethingElse from 'do-something-else';

const drawShip = (ship, x, y) => <translate x={x} y={y}>
  {doSomethingElse()}
  <drawImage img={ship} />
</translate>;

export default drawShip;
```

What does this accomplish?

1. It's a stateless component. (Yay!)
1. View logic is decoupled from draw logic. (Yay!)
1. Game logic is decoupled from view logic. (Yay!)
1. No unwanted side effects. (Yay!)
1. No save/restore needed (Yay!)
1. Bonus: E2DX has a nice XML syntax that looks like JSX (If you like that sort of thing, yay!)

This is better if you want to trade your precious time as a developer for easier and safer results at the cost of a small performance hit. Make no mistake, because it always depends on what your team is willing to work with. `e2d` is a relatively small library and because every kilobyte counts when bundling your application, it's always something to considder.