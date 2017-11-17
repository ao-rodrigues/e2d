# E2D.js - Declarative Canvas vStack Implementation

When it comes to declarative javascript libraries, it's possible to use already created tools like `react-canvas`, `react-konva` and many many more like it. Specifically, when working with canvas, there isn't a need for a node tree or a diffing algorithm at all. Any attempt to render at 60fps, however, must be managed by a component with internal state. In fact, a tree diffing will get in the way of render performance. Most attempts at making react understand a component lifecycle for a canvas would be also slow or feature-incomplete without premade components that make assumptions about how you want to draw to canvas.

This was the motivation to create the library `e2d`. It's sole purpose is to expose a set of functions that allow developers to have more fine grain control over how their canvas works, while also exposing each `CanvasContext2D` function or property as a function that manipulates the state of the context in a declarative fashion.

Take this `hello world` example written with `e2dx` (babel-plugin-e2dx):

```javascript
//import e2d
const e2d = require( "e2d" );
import e2d from "e2d";

//Create the canvas using some basic DOM functions
const ctx = document.createElement( "canvas" ).getContext( "2d" );
const width = ctx.canvas.width = 800;
const height = ctx.canvas.height = 600;
document.body.appendChild( ctx.canvas );

//Always call this to enable mouse and keyboard interaction
e2d.initialize( ctx );

//requestAnimationFrame loop
e2d.raf( function loop () {
  //Get the current mouse position
  const { x, y } = e2d.mouseData( ctx );
  return e2d.render(
    <clearRect width={width} height={height} />,
    <translate x={x} y={y}>
      <fillText text="Hello world!" />
    </translate>,
    ctx
  );
} );
```

This will render text to the screen at 60fps at the current mouse position every frame.

## Getting Started

`e2d` is hosted on npm and can be accessed here at [the unpkg cdn!](https://unpkg.com/e2d)

To use this library, follow these steps:

1. Import `e2d` in your project
2. Create a canvas
3. Get a `CanvasContext2D` object by calling `canvas.getContext("2d")`
4. Initialize the context with `e2d.initialize(ctx)`
5. Draw to the canvas in a `requestAnimationFrame` callback by using the `e2d.render(tree, ctx)` function

This library has no opinion on *framework*, and it is recomended to use `requestAnimationFrame` callbacks to optimize browser painting.

## The API

This api is comprehensive and has *many* instances where default parameters will apply, so argument order counts! Please check out documentation in the [docs](https://github.com/e2d/e2d/blob/master/docs/readme.md) folder.


# License

The MIT License (MIT)

Copyright (c) 2017 Joshua Tenner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
