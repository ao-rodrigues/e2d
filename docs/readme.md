# e2d.js Documentation

Welcome to the `e2d.js` documentation! All of the functions have been grouped by their logical purpose in the `docs` folder of this repo. Please file an issue if any of the documentation is unclear or could be made better.

## Design Philosophy

The design philosophy behind `e2d` was tweaked and developed over the course of two years of research into how the `CanvasContext2D.prototype` works. As the developer of this project I wanted to do the following things:

1. Mirror the Canvas API (MDN documentation was a huge boon!)
2. Polyfill useful functions (ellipse, fillArc, strokeArc...)
3. Add support for mouse, keyboard, touch (coming soon!) and hitDetection, node.js (coming soon!)
4. Learn and grow in my understanding of how JS works
5. Put forth something developers can actually use

## vStack Importance

The `vStack` is an idea that allows a developer to make the smallest number of changes to a `CanvasRendererContext2D` object when dealing with drawing multiple complex things.

For instance, when drawing a polygon, it's often beneficial to use the `ctx.save()` and `ctx.restore()` fuctions to make some sense of the imperative API provided by the context. However, `save` and `restore` will copy and restore the entire canvas context state. Instead, it's much more beneficial to restore a `fillStyle` by simply returning it to it's former value. For example:

```javascript
const redSquare = (ctx, x, y, width, height) => {
  const previousStyle = ctx.fillStyle;
  ctx.fillStyle = 'red';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = previousStyle;
};
```

Indeed, this is the *fastest* way to restore a `fillStyle` after setting it. This is functionality encapsulated by the `e2d` library. However, the problem becomes more complex with you mix and match functions that rely on context state.

```javascript
const drawShip = (ctx, ship, x, y) => {
  ctx.translate(x, y);
  //what happens inside here?
  doSomethingElse(ctx);
  ctx.drawImage(ship, 0, 0, ship.width, ship.height);
};

export default drawShip;
```

In the large majority of cases, you know exactly what happens in your functions, but what happens if you consume someone else's library? What exactly are they doing with your canvas context? Can you garuntee that the changes made to the context within the `doSomethingElse` function won't have side effects? This is something you must always considder as a canvas developer. Of course, one way to solve the problem is as follows:

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

Now we are safe from function side effects. E2D solves this problem with a bit more elegance by exposing an API that cleans itself up when rendering the tree.

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

1. The view function has a purpose (It's a stateless component now)
2. The drawImage function is free of unwanted side effects
3. No need to call save/restore to verify expected canvas state
4. If you used E2DX, then you have a nice xml syntax to go along with it

This is better if you want to trade time for results and a small performance hit, but it always depends on what your team is willing to work with. `e2d` is a 13kb minified library, and every kilobyte counts when bundling your application.

# Table of Contents

The following sections document the different types of functions and properties provided by the `CanvasRenderingContext2D.prototype` and how they are encapsulated.

- [Transforms](https://github.com/e2d/e2d/blob/master/docs/transforms/readme.md)
