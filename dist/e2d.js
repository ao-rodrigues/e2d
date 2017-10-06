(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.e2d = factory());
}(this, (function () { 'use strict';

const transformPoints = (points, matrix) => {
  const result = [];
  let x, y;

  for(let i = 0; i < points.length; i++) {
    [x, y] = points[i];
    result.push([
      matrix[0] * x + matrix[2] * y + matrix[4],
      matrix[1] * x + matrix[3] * y + matrix[5]
    ]);
  }
  return result;
};

let det = 0;
const invertMatrix = ([a, b, c, d, e, f]) => (
  det = 1 / (a * d - c * b),
  [
    d * det,
    -c * det,
    -b * det,
    a * det,
    (b * f - e * d) * det,
    (e * b - a * f) * det
  ]
);

const pointInRect = ([px, py], [[x, y], [width, height]]) => px > x && py > y && px < width && py < height;

const pointInCircle = ([x, y], [cx, cy, cr]) => ((cx - x) ** 2 + (cy - y) ** 2) < cr ** 2;

var pointInPolygon = function (point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

const alwaysFalse = () => false;

const activeRegions = (ctx) => {
  const regions = ctx.canvas[Symbol.for('regions')],
    mousePoints = ctx.canvas[Symbol.for('mousePoints')],
    mouseData = ctx.canvas[Symbol.for('mouseData')],
    results = {};

  //the mouse might have held still, add the current mouse position to make the data consistent
  if (mousePoints.length === 0) {
    mousePoints.push([mouseData.x, mouseData.y, mouseData.state]);
  }

  for (const region of regions) {

    //invert the region matrix and transform the mouse points
    const transformedMousePoints = transformPoints(mousePoints, invertMatrix(region.matrix));

    //the mouse points are now relative to the mouse region, use the appropriate test
    const test = region.type === 'hitRect' ? pointInRect :
      region.type === 'hitRegion' ? pointInPolygon :
      region.type === 'hitCircle' ? pointInCircle :
      alwaysFalse;
    for (const mousePoint of transformedMousePoints) {
      if (test(mousePoint, region.points)) {
        region.hover = true;
        region.clicked = !!mouseData.clicked;
        results[region.id] = region;
        break;
      }
    }
  }
  return results;
};

class Instruction {
  constructor(type, props) {
    this.type = type;
    this.props = props;
    return Object.seal(this);
  }
}

Object.seal(Instruction);
Object.seal(Instruction.prototype);

const pi2 = Math.PI * 2;

const arc = (...args) => {
  if (args.length > 3) {
    return new Instruction("call", { name: 'arc', args, count: 6 });
  }
  if (args.length > 1) {
    return new Instruction("call", { name: 'arc', args: [args[0], args[1], args[2], 0, pi2, false], count: 6 });
  }

  return new Instruction("call",  { name: 'arc', args: [0, 0, args[0], 0, pi2, false], count: 6 });
};

const arcTo = (x1, y1, x2, y2, r) => new Instruction('call', { name: 'arcTo', args: [x1, y1, x2, y2, r], count: 5 });

const emptyCall = (name) => () => new Instruction('call', { name, args: [], count: 0 });

var beginPath = emptyCall('beginPath');

const bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => new Instruction('call', {
  name: 'bezierCurveTo',
  args: [cp1x, cp1y, cp2x, cp2y, x, y],
  count: 5
});

const rectInstruction = (name) => (...args) => new Instruction("call", {
  name,
  args: args.length > 2 ? args : [0, 0, args[0], args[1]],
  count: 4
});

var clearRect = rectInstruction('clearRect');

const begin = [emptyCall('save'), emptyCall('beginPath')];
const performClip = emptyCall('clip');
const end = emptyCall('restore');

const clip = (path, ...children) => [
  begin,
  path,
  performClip,
  children,
  end
];

const clipPath = () => new Instruction('call', { name: 'clip', args: [], count: 0 });

var closePath = emptyCall('closePath');

const PI2 = Math.PI * 2;
const createRegularPolygon = (radius = 0, position = [0, 0], sides = 3) => {
  const polygon = [];
  const factor = PI2 / sides;
  for(let i = 0; i < sides; i++) {
    polygon.push([
      position[0] + radius * Math.cos(factor * i),
      position[1] + radius * Math.sin(factor * i)
    ]);
  }
  return polygon;
};

const drawImage = (...args) => {
  if (args.length >= 9) {
    return new Instruction('call', {
      name: 'drawImage',
      args,
      count: 9
    });
  }

  const [img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight] = args;

  if (args.length >= 5) {
    return new Instruction('call', {
      name: 'drawImage',
      args: [img, sx, sy, sWidth, sHeight],
      count: 5
    });
  }

  return new Instruction('call', {
    name: 'drawImage',
    args: args.length >= 3 ? [img, sx, sy] : [img, 0, 0],
    count: 3
  });
};

const pi2$1 = Math.PI * 2;

const ellipse = (...args) => {
  const [x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise] = args;

  //const props = { x: 0, y: 0, radiusX: x, radiusY: y, rotation: 0, startAngle: 0, endAngle: pi2, anticlockwise: false };
  return new Instruction('call', {
    name: 'ellipse',
    args: args.length > 5 ? args :
      args.length > 4 ? [x, y, radiusX, radiusY, rotation, startAngle, false] :
      args.length > 2 ? [x, y, radiusX, radiusY, 0, pi2$1, false] :
      [0, 0, x, y, 0, pi2$1, false],
    count: 7
  });
};

var endClip = emptyCall('restore');

const extend = (ctx, ...methods) => {
  const extensions = ctx[Symbol.for('extensions')] || (ctx[Symbol.for('extensions')] = {});
  Object.assign(extensions, ...methods);
};

var fill = emptyCall('fill');

const pi2$2 = Math.PI * 2;

const fillArc = (...args) => {
  const [x, y, r, startAngle, endAngle, counterclockwise] = args;
  const props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2$2, counterclockwise: false };


  if (args.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (args.length >= 2) {
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("fillArc",  props);
};

var fillRect = rectInstruction('fillRect');

const stackable = (stack) => {
  const end = new Instruction('pop', { stack });
  const stackableFunc = (value, ...children) => [
    new Instruction('push', { stack, value }),
    ...children,
    end
  ];

  return stackableFunc;
};

var fillStyle = stackable('fillStyle');

const textInstruction = (name) => (...args) => new Instruction('call', {
  name,
  args: args.length >= 3 ? args : [args[0], 0, 0],
  count: args.length >= 4 ? 4 : 3
});

var fillText = textInstruction('fillText');

const end$1 = new Instruction('endGlobalAlpha');

const globalAlpha = (value, ...children) => [
  new Instruction('globalAlpha', { value }),
  children,
  end$1
];

var globalCompositeOperation = stackable('globalCompositeOperation');

const hitCircle = (id, ...args) => new Instruction('hitCircle', {
  id,
  points: args.length === 1 ? [0, 0, args[0]] : [args[0], args[1], args[2]]
});

const hitRect = (id, ...args) => {
  let [x, y, width, height] = args;
  if (args.length <= 3) {
    width = x;
    height = y;
    x = 0;
    y = 0;
  }
  return new Instruction('hitRect', {
    id,
    points: [
      [x, y],
      [x + width, y + height]
    ]
  });
};

const hitRegion = (id, points) => new Instruction('hitRegion', { id, points });

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var keycode = createCommonjsModule(function (module, exports) {
// Source: http://jsfiddle.net/vWx8V/
// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

/**
 * Conenience method returns corresponding value for given keyName or keyCode.
 *
 * @param {Mixed} keyCode {Number} or keyName {String}
 * @return {Mixed}
 * @api public
 */

exports = module.exports = function(searchInput) {
  // Keyboard Events
  if (searchInput && 'object' === typeof searchInput) {
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
    if (hasKeyCode) searchInput = hasKeyCode;
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput);

  // check codes
  var foundNamedKey = codes[search.toLowerCase()];
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()];
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
};

/**
 * Get by name
 *
 *   exports.code['enter'] // => 13
 */

var codes = exports.code = exports.codes = {
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl': 17,
  'alt': 18,
  'pause/break': 19,
  'caps lock': 20,
  'esc': 27,
  'space': 32,
  'page up': 33,
  'page down': 34,
  'end': 35,
  'home': 36,
  'left': 37,
  'up': 38,
  'right': 39,
  'down': 40,
  'insert': 45,
  'delete': 46,
  'command': 91,
  'left command': 91,
  'right command': 93,
  'numpad *': 106,
  'numpad +': 107,
  'numpad -': 109,
  'numpad .': 110,
  'numpad /': 111,
  'num lock': 144,
  'scroll lock': 145,
  'my computer': 182,
  'my calculator': 183,
  ';': 186,
  '=': 187,
  ',': 188,
  '-': 189,
  '.': 190,
  '/': 191,
  '`': 192,
  '[': 219,
  '\\': 220,
  ']': 221,
  "'": 222
};

// Helper aliases

var aliases = exports.aliases = {
  'windows': 91,
  '⇧': 16,
  '⌥': 18,
  '⌃': 17,
  '⌘': 91,
  'ctl': 17,
  'control': 17,
  'option': 18,
  'pause': 19,
  'break': 19,
  'caps': 20,
  'return': 13,
  'escape': 27,
  'spc': 32,
  'pgup': 33,
  'pgdn': 34,
  'ins': 45,
  'del': 46,
  'cmd': 91
};


/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32;

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i;

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111;

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96;

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {}; // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i;

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias];
}
});

const initialize = (ctx) => {
  const { canvas } = ctx;

  //mouseData
  canvas[Symbol.for('mouseData')] = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    previousX: 0,
    previousY: 0,
    state: false,
    clicked: 0
  };

  const keys = canvas[Symbol.for('keyData')] = {};

  for (const name in keycode.code) {
    if (keycode.code.hasOwnProperty(name)) {
      keys[name] = false;
    }
  }

  //mouse regions
  canvas[Symbol.for('regions')] = [];
  canvas[Symbol.for('mousePoints')] = [];

  //make the canvas receive touch and mouse events
  canvas.tabIndex = 1;

  const mouseMove = (evt) => {
    const { clientX, clientY } = evt;

    //get left and top coordinates
    const { left, top } = canvas.getBoundingClientRect();

    const mouseData = canvas[Symbol.for('mouseData')];

    const point = [clientX - left, clientY - top, mouseData.state];

    mouseData.x = point[0];
    mouseData.y = point[1];

    const points = canvas[Symbol.for('mousePoints')];

    points.push(point);

    //store the last 100 stored positions for hover detection
    if (points.length > 100) {
      points.splice(0, points.length - 100);
    }

    evt.preventDefault();
    return false;
  };

  //up target needs to detect mouse up and keyup events if the mouse leaves the canvas
  const upTarget = typeof window !== 'undefined' ? window : canvas;

  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('mousedown', (evt) => {
    const { target } = evt;
    if (target === canvas) {
      const mouseData = canvas[Symbol.for('mouseData')];

      if (!mouseData.state) {
        mouseData.clicked += 1;
      }

      mouseData.state = true;
      return mouseMove(evt);
    }
  });

  canvas.addEventListener('keydown', (evt) => {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = true;
    evt.preventDefault();
    return false;
  });


  upTarget.addEventListener('mouseup', (evt) => {
    const mouseData = canvas[Symbol.for('mouseData')];
    mouseData.state = false;
    mouseMove(evt);
  });

  upTarget.addEventListener('keyup', (evt) => {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = false;
    evt.preventDefault();
  });
};

const keyData = (ctx) => ctx.canvas[Symbol.for('keyData')];

const end$2 = new Instruction('endLineStyle');

const lineStyle = (value, ...children) => {
  value = value || {};
  
  var result = {
    lineWidth: null,
    lineCap: null,
    lineJoin: null,
    miterLimit: null,
    lineDash: null,
    lineDashOffset: null
  };

  if (typeof value.lineWidth !== 'undefined') {
    result.lineWidth = value.lineWidth;
  }
  if (typeof value.lineCap !== 'undefined') {
    result.lineCap = value.lineCap;
  }
  if (typeof value.lineJoin !== 'undefined') {
    result.lineJoin = value.lineJoin;
  }
  if (typeof value.miterLimit !== 'undefined') {
    result.miterLimit = value.miterLimit;
  }
  if (typeof value.lineDash !== 'undefined') {
    result.lineDash = value.lineDash || [];
  }
  if (typeof value.lineDashOffset !== 'undefined') {
    result.lineDashOffset = value.lineDashOffset;
  }
  return [
    new Instruction('lineStyle', result),
    children,
    end$2
  ];
};

const pointInstruction = (name) => (x, y) => new Instruction("call", {
  name,
  args: [x, y],
  count: 2
});

var lineTo = pointInstruction('lineTo');

const mouseData = (ctx) => ctx.canvas[Symbol.for('mouseData')];

var moveTo = pointInstruction('moveTo');

const moveToLineTo = (point, index) => index === 0 ?
  moveTo(point[0], point[1]) :
  lineTo(point[0], point[1]);

const path = (...children) => [
  beginPath(),
  children,
  closePath()
];

const quadraticCurveTo = (cpx, cpy, x, y) => new Instruction('call', { name: 'quadraticCurveTo', args: [cpx, cpy, x, y], count: 4 });

const raf = (func) => {
  const funcCaller = function() {
    requestAnimationFrame(funcCaller);
    return func();
  };

  requestAnimationFrame(funcCaller);
};

var rect = rectInstruction('rect');

const cycleMouseData = (ctx) => {
  const mouseData = ctx.canvas[Symbol.for('mouseData')];
  if (mouseData) {
    mouseData.dx = mouseData.x - mouseData.previousX;
    mouseData.dy = mouseData.y - mouseData.previousY;

    mouseData.previousX = mouseData.x;
    mouseData.previousY = mouseData.y;

    mouseData.clicked = 0;
  }
};

//initialize all the properties
const identity = [1, 0, 0, 1, 0, 0];
const concat = [].concat;

//transform points function
const relativeTransforms = {
  transform: true,
  scale: true,
  rotate: true,
  translate: true,
  skewX: true,
  skewY: true
};

const upTransforms = {
  transform: true,
  scale: true,
  rotate: true,
  translate: true,
  skewX: true,
  skewY: true,
  setTransform: true
};

const render = (...args) => {
  let children = args.slice(0, -1),
    isTransformDirty = true,
    transformStackIndex = 6,
    transformStack = new Float64Array(501 * 6),
    cache;

  transformStack.set(identity);

  const ctx = args[args.length - 1];

  cycleMouseData(ctx);

  const matrix = new Float64Array(identity),
    regions = ctx.canvas[Symbol.for('regions')] = [],
    mousePoints = ctx.canvas[Symbol.for('mousePoints')] = [],
    extensions = ctx.canvas[Symbol.for('extensions')];

  const stack = {
    fillStyle: [],
    strokeStyle: [],
    globalCompositeOperation: [],
    imageSmoothingEnabled: [],
  };

  const lineStyleStack = [],
    textStyleStack = [],
    shadowStyleStack = [],
    globalAlphaStack = [];

  transformStack[0] = identity[0];
  transformStack[1] = identity[1];
  transformStack[2] = identity[2];
  transformStack[3] = identity[3];
  transformStack[4] = identity[4];
  transformStack[5] = identity[5];

  const increaseTransformStackSize = () => {
    cache = transformStack;
    transformStack = new Float64Array(transformStack.length + 600); //add 100 more
    transformStack.set(cache);
  };

  

  let len = children.length;

  //flatten children during the loop process to save cpu
  for (let i = 0; i < len; i++) {
    let child = children[i];

    //flatten as you go algorithm
    if (child && child.constructor === Array) {
      children = concat.apply([], children);
      child = children[i];

      //repeat as necessary
      while (child && child.constructor === Array) {
        children = concat.apply([], children);
        child = children[i];
      }

      len = children.length;
    }

    //child must be truthy
    if (!child) {
      continue;
    }

    const { props, type } = child;

    if (relativeTransforms[type]) {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];
    }

    if (upTransforms[type]) {
      //increase the index
      transformStackIndex += 6;
      if (transformStackIndex >= transformStack.length) {
        increaseTransformStackSize();
      }
    }

    switch (type) {
      case 'transform':
        //perform the transform math
        transformStack[transformStackIndex - 6] = //d
          matrix[0] * props[0] + matrix[2] * props[1];
        transformStack[transformStackIndex - 5] = //b
          matrix[1] * props[0] + matrix[3] * props[1];
        transformStack[transformStackIndex - 4] = //c
          matrix[0] * props[2] + matrix[2] * props[3];
        transformStack[transformStackIndex - 3] = //d
          matrix[1] * props[2] + matrix[3] * props[3];
        transformStack[transformStackIndex - 2] = //e
          matrix[0] * props[4] + matrix[2] * props[5] + matrix[4];
        transformStack[transformStackIndex - 1] = //f
          matrix[1] * props[4] + matrix[3] * props[5] + matrix[5];

        isTransformDirty = true;
        continue;

      case "setTransform":
        transformStack[transformStackIndex - 6] = props[0];//a
        transformStack[transformStackIndex - 5] = props[1];//b
        transformStack[transformStackIndex - 4] = props[2];//c
        transformStack[transformStackIndex - 3] = props[3];//d
        transformStack[transformStackIndex - 2] = props[4];//e
        transformStack[transformStackIndex - 1] = props[5];//f

        isTransformDirty = true;
        continue;

      case "scale":
        transformStack[transformStackIndex - 6] = matrix[0] * props.x; //a
        transformStack[transformStackIndex - 5] = matrix[1] * props.x; //b
        transformStack[transformStackIndex - 4] = matrix[2] * props.y; //c
        transformStack[transformStackIndex - 3] = matrix[3] * props.y; //d
        transformStack[transformStackIndex - 2] = matrix[4]; //e
        transformStack[transformStackIndex - 1] = matrix[5]; //f

        isTransformDirty = true;
        continue;

      case "translate":
        transformStack[transformStackIndex - 6] = matrix[0]; //a
        transformStack[transformStackIndex - 5] = matrix[1]; //b
        transformStack[transformStackIndex - 4] = matrix[2]; //c
        transformStack[transformStackIndex - 3] = matrix[3]; //d
        transformStack[transformStackIndex - 2] = matrix[4] + matrix[0] * props.x + matrix[2] * props.y; //e
        transformStack[transformStackIndex - 1] = matrix[5] + matrix[1] * props.x + matrix[3] * props.y; //f

        isTransformDirty = true;
        continue;

      case "rotate":
        transformStack[transformStackIndex - 6] =
          matrix[0] * props.cos + matrix[2] * props.sin; //a
        transformStack[transformStackIndex - 5] =
          matrix[1] * props.cos + matrix[3] * props.sin; //b
        transformStack[transformStackIndex - 4] =
          matrix[0] * -props.sin + matrix[2] * props.cos; //c
        transformStack[transformStackIndex - 3] =
          matrix[1] * -props.sin + matrix[3] * props.cos; //d
        transformStack[transformStackIndex - 2] = matrix[4]; //e
        transformStack[transformStackIndex - 1] = matrix[5];//f

        isTransformDirty = true;
        continue;

      case "skewX":
        transformStack[transformStackIndex - 6] = matrix[0]; //a
        transformStack[transformStackIndex - 5] = matrix[1]; //b
        transformStack[transformStackIndex - 4] = //c
          matrix[0] * props.x + matrix[2];
        transformStack[transformStackIndex - 3] = //d
          matrix[1] * props.x + matrix[3];
        transformStack[transformStackIndex - 2] = matrix[4]; //e
        transformStack[transformStackIndex - 1] = matrix[5]; //f

        isTransformDirty = true;
        continue;

      case "skewY":
        transformStack[transformStackIndex - 6] =
          matrix[0] * 1 + matrix[2] * props.y; //a
        transformStack[transformStackIndex - 5] =
          matrix[1] * 1 + matrix[3] * props.y; //b
        transformStack[transformStackIndex - 4] = matrix[2]; //c
        transformStack[transformStackIndex - 3] = matrix[3]; //d
        transformStack[transformStackIndex - 2] = matrix[4]; //e
        transformStack[transformStackIndex - 1] = matrix[5]; //f

        isTransformDirty = true;
        continue;

      case "restore":
        transformStackIndex -= 6;
        isTransformDirty = true;
        continue;
    }

    if (isTransformDirty) {
      isTransformDirty = false;
      ctx.setTransform(
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      );
    }


    switch (type) {
      case 'push':
        stack[props.stack].push(ctx[props.stack]);
        ctx[props.stack] = props.value;
        continue;

      case 'pop':
        ctx[props.stack] = stack[props.stack].pop();
        continue;


      case 'call':
        const { name, args, count } = props;
        switch (count) {
          case 0:
            ctx[name]();
            continue;
          case 1:
            ctx[name](args[0]);
            continue;
          case 2:
            ctx[name](args[0], args[1]);
            continue;
          case 3:
            ctx[name](args[0], args[1], args[2]);
            continue;
          case 4:
            ctx[name](args[0], args[1], args[2], args[3]);
            continue;
          case 5:
            ctx[name](args[0], args[1], args[2], args[3], args[4]);
            continue;
          case 6:
            ctx[name](args[0], args[1], args[2], args[3], args[4], args[5]);
            continue;
          case 7:
            ctx[name](args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            continue;
          case 8:
            ctx[name](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            continue;
          case 9:
            ctx[name](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
            continue;
        }

      case 'lineStyle':
        lineStyleStack.push({
          lineWidth: ctx.lineWidth,
          lineCap: ctx.lineCap,
          lineJoin: ctx.lineJoin,
          miterLimit: ctx.miterLimit,
          lineDash: ctx.getLineDash(),
          lineDashOffset: ctx.lineDashOffset
        });

        if (props.lineWidth !== null) {
          ctx.lineWidth = props.lineWidth;
        }
        if (props.lineCap !== null) {
          ctx.lineCap = props.lineCap;
        }
        if (props.lineJoin !== null) {
          ctx.lineJoin = props.lineJoin;
        }
        if (props.miterLimit !== null) {
          ctx.miterLimit = props.miterLimit;
        }
        if (props.lineDash !== null) {
          ctx.setLineDash(props.lineDash);
        }

        if (props.lineDashOffset !== null) {
          ctx.lineDashOffset = props.lineDashOffset;
        }
        continue;

      case 'endLineStyle':
        cache = lineStyleStack.pop();
        ctx.lineWidth = cache.lineWidth;
        ctx.lineCap = cache.lineCap;
        ctx.lineJoin = cache.lineJoin;
        ctx.miterLimit = cache.miterLimit;
        ctx.setLineDash(cache.lineDash);
        ctx.lineDashOffset = cache.lineDashOffset;

        continue;

      case 'textStyle':
        textStyleStack.push({
          font: ctx.font,
          textAlign: ctx.textAlign,
          textBaseline: ctx.textBaseline,
          direction: ctx.direction
        });
        if (props.font !== null) {
          ctx.font = props.font;
        }
        if (props.textAlign !== null) {
          ctx.textAlign = props.textAlign;
        }
        if (props.textBaseline !== null) {
          ctx.textBaseline = props.textBaseline;
        }
        if (props.direction !== null) {
          ctx.direction = props.direction;
        }
        continue;

      case 'endTextStyle':
        cache = textStyleStack.pop();
        ctx.font = cache.font;
        ctx.textAlign = cache.textAlign;
        ctx.textBaseline = cache.textBaseline;
        ctx.direction = cache.direction;
        continue;

      case 'shadowStyle':
        shadowStyleStack.push({
          shadowBlur: ctx.shadowBlur,
          shadowColor: ctx.shadowColor,
          shadowOffsetX: ctx.shadowOffsetX,
          shadowOffsetY: ctx.shadowOffsetY
        });
        if (props.shadowBlur !== null) {
          ctx.shadowBlur = props.shadowBlur;
        }
        if (props.shadowColor !== null) {
          ctx.shadowColor = props.shadowColor;
        }
        if (props.shadowOffsetX !== null) {
          ctx.shadowOffsetX = props.shadowOffsetX;
        }
        if (props.shadowOffsetY !== null) {
          ctx.shadowOffsetY = props.shadowOffsetY;
        }
        continue;

      case 'endShadowStyle':
        cache = shadowStyleStack.pop();
        ctx.shadowBlur = cache.shadowBlur;
        ctx.shadowColor = cache.shadowColor;
        ctx.shadowOffsetX = cache.shadowOffsetX;
        ctx.shadowOffsetY = cache.shadowOffsetY;
        continue;

      case 'strokeArc':
        ctx.beginPath();
        ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.counterclockwise);
        ctx.closePath();
        ctx.stroke();
        continue;

      case 'fillArc':
        ctx.beginPath();
        ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.counterclockwise);
        ctx.closePath();
        ctx.fill();
        continue;

      case 'globalAlpha':
        globalAlphaStack.push(ctx.globalAlpha);
        ctx.globalAlpha *= props.value;
        continue;

      case 'endGlobalAlpha':
        ctx.globalAlpha = globalAlphaStack.pop();
        continue;

      case 'hitRect':
      case 'hitRegion':
      case 'hitCircle':
        if (regions) {
          regions.push({
            id: props.id,
            points: props.points,
            matrix: [
              transformStack[transformStackIndex - 6],
              transformStack[transformStackIndex - 5],
              transformStack[transformStackIndex - 4],
              transformStack[transformStackIndex - 3],
              transformStack[transformStackIndex - 2],
              transformStack[transformStackIndex - 1]
            ],
            //rectangle!
            type,
            hover: false,
            touched: false,
            clicked: false
          });
        }
        continue;

      default:
        if (extensions && extensions[type]) {
          extensions[type](props, ctx);
        }
        continue;
    }
  }
};

const end$3 = new Instruction('restore');

const rotate = (r, ...children) => [
  new Instruction('rotate', { cos: Math.cos(r), sin: Math.sin(r) }),
  children,
  end$3
];

const end$4 = new Instruction('restore');

const scale = (x, y, ...children) => {
  if (typeof y !== 'number') {
    children = [y].concat(children);
    y = x;
  }

  return [
    new Instruction('scale', { x, y }),
    children,
    end$4
  ];
};

const end$5 = new Instruction('restore');

const setTransform = (matrix, ...children) => [
  new Instruction('setTransform', [
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5]
  ]),
  children,
  end$5
];

const end$6 = new Instruction('endShadowStyle');

const shadowStyle = (value, ...children) => {
  value = value || {};
  const result = {
    shadowBlur: null,
    shadowColor: null,
    shadowOffsetX: null,
    shadowOffsetY: null
  };

  if (typeof value.shadowBlur !== 'undefined') {
    result.shadowBlur = value.shadowBlur;
  }
  if (typeof value.shadowColor !== 'undefined') {
    result.shadowColor = value.shadowColor;
  }
  if (typeof value.shadowOffsetX !== 'undefined') {
    result.shadowOffsetX = value.shadowOffsetX;
  }
  if (typeof value.direction !== 'undefined') {
    result.shadowOffsetY = value.shadowOffsetY;
  }

  return [
    new Instruction('shadowStyle', result),
    children,
    end$6
  ];
};

const end$7 = new Instruction('restore');

const skewX = (x, ...children) => [
  new Instruction('skewX', { x: Math.tan(x) }),
  children,
  end$7
];

const end$8 = new Instruction('restore');

const skewY = (y, ...children) => [
  new Instruction('skewY', { y: Math.tan(y) }),
  children,
  end$8
];

var stroke = emptyCall('stroke');

const pi2$3 = Math.PI * 2;

const strokeArc = (...args) => {
  const [x, y, r, startAngle, endAngle, counterclockwise] = args;
  const props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2$3, counterclockwise: false };

  if (args.length > 3) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.counterclockwise = !!counterclockwise;
  }

  if (args.length > 1){
    props.x = x;
    props.y = y;
    props.r = r;
  }

  return new Instruction("strokeArc",  props);
};

var strokeRect = rectInstruction('strokeRect');

var strokeStyle = stackable('strokeStyle');

var strokeText = textInstruction('strokeText');

const end$9 = new Instruction('endTextStyle');

const textStyle = (value, ...children) => {
  value = value || {};
  const result = {
    font: null,
    textAlign: null,
    textBaseline: null,
    direction: null
  };

  if (typeof value.font !== 'undefined') {
    result.font = value.font;
  }
  if (typeof value.textAlign !== 'undefined') {
    result.textAlign = value.textAlign;
  }
  if (typeof value.textBaseline !== 'undefined') {
    result.textBaseline = value.textBaseline;
  }
  if (typeof value.direction !== 'undefined') {
    result.direction = value.direction;
  }

  return [
    new Instruction('textStyle', result),
    children,
    end$9
  ];
};

const end$10 = new Instruction('restore');

const transform = (values, ...children) => {
  return [
    new Instruction('transform', [
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5]
    ]),
    children,
    end$10
  ];
};

const end$11 = new Instruction('restore');

const translate = (x, y, ...children) => [
  new Instruction('translate', { x, y }),
  children,
  end$11
];

var index = {
  activeRegions,
  arc,
  arcTo,
  beginPath,
  bezierCurveTo,
  clearRect,
  clip,
  clipPath,
  closePath,
  createRegularPolygon,
  drawImage,
  ellipse,
  endClip,
  extend,
  fill,
  fillArc,
  fillRect,
  fillStyle,
  fillText,
  globalAlpha,
  globalCompositeOperation,
  hitCircle,
  hitRect,
  hitRegion,
  imageSmoothingEnabled: hitRegion,
  initialize,
  Instruction,
  invertMatrix,
  keyData,
  lineStyle,
  lineTo,
  mouseData,
  moveTo,
  moveToLineTo,
  path,
  pointInRect,
  quadraticCurveTo,
  raf,
  rect,
  render,
  resetTransform: render,
  rotate,
  scale,
  setTransform,
  shadowStyle,
  skewX,
  skewY,
  stroke,
  strokeArc,
  strokeRect,
  strokeStyle,
  strokeText,
  textStyle,
  transform,
  transformPoints,
  translate,
};

return index;

})));
