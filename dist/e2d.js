(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.e2d = factory());
}(this, (function () { 'use strict';

function transformPoints(points, [a, b, c, d, e, f]) {
  const result = [];
  let x, y;

  for (const point of points) {
    [x, y] = point;
    result.push([a * x + c * y + e, b * x + d * y + f]);
  }

  return result;
}

let det = 0;
const invertMatrix = ([a, b, c, d, e, f]) => (
  (det = 1 / (a * d - c * b)),
  [d * det, -c * det, -b * det, a * det, (b * f - e * d) * det, (e * b - a * f) * det]
);

const pointInRect = ([px, py], [[x, y], [width, height]]) =>
  px > x && py > y && px < width && py < height;

const pointInCircle = ([x, y], [cx, cy, cr]) => (cx - x) ** 2 + (cy - y) ** 2 < cr ** 2;

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

function call(ctx, instruction) {
  switch (instruction.props.count) {
    case 0:
      return ctx[instruction.props.name]();
    case 1:
      return ctx[instruction.props.name](instruction.props.args[0]);
    case 2:
      return ctx[instruction.props.name](instruction.props.args[0], instruction.props.args[1]);
    case 3:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
      );
    case 4:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
      );
    case 5:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
      );
    case 6:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
        instruction.props.args[5],
      );
    case 7:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
        instruction.props.args[5],
        instruction.props.args[6],
      );
    case 8:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
        instruction.props.args[5],
        instruction.props.args[6],
        instruction.props.args[7],
      );
    case 9:
      return ctx[instruction.props.name](
        instruction.props.args[0],
        instruction.props.args[1],
        instruction.props.args[2],
        instruction.props.args[3],
        instruction.props.args[4],
        instruction.props.args[5],
        instruction.props.args[6],
        instruction.props.args[7],
        instruction.props.args[8],
      );
  }
}

const empty = [];
const concat = empty.concat;

var pointInPath = ([x, y], instructions) => {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.canvas.width = 1;
  ctx.canvas.height = 1;

  for (let i = 0; i < instructions.length; i++) {
    while (instructions[i] && instructions[i].constructor === Array) {
      instructions = concat.apply(empty, instructions);
    }
    if (!instructions[i]) {
      continue;
    }
    call(ctx, instructions[i]);
  }

  return ctx.isPointInPath(x, y);
};

const alwaysFalse = () => false;

function activeRegions(ctx) {
  const regions = ctx.canvas[Symbol.for('regions')],
    mousePoints = ctx.canvas[Symbol.for('mousePoints')],
    mouseData = ctx.canvas[Symbol.for('mouseData')],
    results = {};

  //The mouse might have held still, add the current mouse position to make the data consistent
  if (mousePoints.length === 0) {
    mousePoints.push([mouseData.x, mouseData.y, mouseData.state]);
  }

  for (const region of Object.values(regions)) {
    //Invert the region matrix and transform the mouse points
    const transformedMousePoints =
      region.type === 'hitRegion'
        ? mousePoints
        : transformPoints(mousePoints, invertMatrix(region.matrix));

    //The mouse points are now relative to the mouse region, use the appropriate test
    const test =
      region.type === 'hitRegion'
        ? pointInPath
        : region.type === 'hitRect'
          ? pointInRect
          : region.type === 'hitPolygon'
            ? pointInPolygon
            : region.type === 'hitCircle' ? pointInCircle : alwaysFalse;
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
}

class Instruction {
  constructor(type, props) {
    this.type = type;
    this.props = props;
    return Object.seal(this);
  }
}

Object.seal(Instruction);
Object.seal(Instruction.prototype);

var Tau = Math.PI * 2;

function arc(x, y, r, startAngle, endAngle, anticlockwise) {
  if (arguments.length > 3) {
    return new Instruction('call', {
      name: 'arc',
      args: [x, y, r, startAngle, endAngle, !!anticlockwise],
      count: 6,
    });
  }
  if (arguments.length > 1) {
    return new Instruction('call', {
      name: 'arc',
      args: [x, y, r, 0, Tau, false],
      count: 6,
    });
  }

  return new Instruction('call', {
    name: 'arc',
    args: [0, 0, x, 0, Tau, false],
    count: 6,
  });
}

function arcTo(x1, y1, x2, y2, r) {
  return new Instruction('call', {
    name: 'arcTo',
    args: [x1, y1, x2, y2, r],
    count: 5,
  });
}

const emptyCall = name =>
  function() {
    return new Instruction('call', { name, args: [], count: 0 });
  };

var beginPath = emptyCall('beginPath');

function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
  return new Instruction('call', {
    name: 'bezierCurveTo',
    args: [cp1x, cp1y, cp2x, cp2y, x, y],
    count: 5,
  });
}

const rectInstruction = name => (...args) =>
  new Instruction('call', {
    name,
    args: args.length > 2 ? args : [0, 0, args[0], args[1]],
    count: 4,
  });

var clearRect = rectInstruction('clearRect');

const clipPath = emptyCall('clip');

const begin = emptyCall('save')();
const beginPathInstruction = beginPath();
const clipPathInstruction = clipPath();
const end = emptyCall('restore')();

function clip(path, ...children) {
  return [begin, beginPathInstruction, path, clipPathInstruction, children, end];
}

var closePath = emptyCall('closePath');

function createRegularPolygon(radius = 0, position = [0, 0], sides = 3) {
  const polygon = [];
  const factor = Tau / sides;
  let value = 0;
  for (let i = 0; i < sides; i++) {
    polygon.push([position[0] + radius * Math.cos(value), position[1] + radius * Math.sin(value)]);
    value += factor;
  }
  return polygon;
}

const stackable = stack => {
  const end = new Instruction('pop', { stack });
  const stackableFunc = (value, ...children) => [
    new Instruction('push', { stack, value }),
    ...children,
    end,
  ];

  return stackableFunc;
};

var directionCall = stackable('direction');

function drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
  if (arguments.length >= 9) {
    return new Instruction('call', {
      name: 'drawImage',
      args: [img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight],
      count: 9,
    });
  }

  if (arguments.length >= 5) {
    return new Instruction('call', {
      name: 'drawImage',
      args: [img, sx, sy, sWidth, sHeight],
      count: 5,
    });
  }

  return new Instruction('call', {
    name: 'drawImage',
    args: arguments.length >= 3 ? [img, sx, sy] : [img, 0, 0],
    count: 3,
  });
}

function ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
  return new Instruction('call', {
    name: 'ellipse',
    args:
      arguments.length >= 6
        ? [x, y, radiusX, radiusY, rotation, startAngle, endAngle, !!anticlockwise]
        : arguments.length === 5
          ? [x, y, radiusX, radiusY, rotation, 0, Tau, false]
          : arguments.length >= 3
            ? [x, y, radiusX, radiusY, 0, 0, Tau, false]
            : [0, 0, x, y, 0, Tau, false],
    count: 7,
  });
}

var endClip = emptyCall('restore');

function extend(ctx, ...methods) {
  const extensions = ctx[Symbol.for('extensions')] || (ctx[Symbol.for('extensions')] = {});
  Object.assign(extensions, ...methods);
}

var fill = emptyCall('fill');

function fillArc(x, y, r, startAngle, endAngle, anticlockwise) {
  const props = [0, 0, x, 0, Tau, false];

  if (arguments.length > 3) {
    props[3] = startAngle;
    props[4] = endAngle;
    props[5] = !!anticlockwise;
  }

  if (arguments.length >= 2) {
    props[0] = x;
    props[1] = y;
    props[2] = r;
  }

  return new Instruction('fillArc', props);
}

var fillRect = rectInstruction('fillRect');

var fillStyle = stackable('fillStyle');

const textInstruction = name =>
  function(text, x, y, maxWidth) {
    return new Instruction('call', {
      name,
      args:
        arguments.length > 3
          ? [text, x, y, maxWidth]
          : arguments.length >= 1 ? [text, x, y] : [text, 0, 0],
      count: arguments.length > 3 ? 4 : 3,
    });
  };

var fillText = textInstruction('fillText');

var fontCall = stackable('font');

var globalAlpha = stackable('globalAlpha');

var globalCompositeOperation = stackable('globalCompositeOperation');

function hitCircle(id, x, y, r) {
  return new Instruction('hitCircle', {
    id,
    points: arguments.length === 1 ? [0, 0, x] : [x, y, r],
  });
}

function hitRect(id, x, y, width, height) {
  if (arguments.length <= 3) {
    width = x;
    height = y;
    x = 0;
    y = 0;
  }
  return new Instruction('hitRect', {
    id,
    points: [[x, y], [x + width, y + height]],
  });
}

function hitPolygon(id, points) {
  return new Instruction('hitPolygon', { id, points });
}

function hitRegion(id, fillRule = null) {
  return new Instruction('hitRegion', { id, fillRule });
}

var imageSmoothingEnabled = stackable('imageSmoothingEnabled');

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

const initialize = ctx => {
  const { canvas } = ctx;

  //MouseData
  canvas[Symbol.for('mouseData')] = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    previousX: 0,
    previousY: 0,
    state: false,
    clicked: 0,
  };

  const keys = (canvas[Symbol.for('keyData')] = {});

  for (const name in keycode.code) {
    if (keycode.code.hasOwnProperty(name)) {
      keys[name] = false;
    }
  }

  //Mouse regions
  canvas[Symbol.for('regions')] = {};
  canvas[Symbol.for('mousePoints')] = [];

  //Make the canvas receive touch and mouse events
  canvas.tabIndex = 1;

  const mouseMove = evt => {
    const { clientX, clientY } = evt;

    //Get left and top coordinates
    const { left, top } = canvas.getBoundingClientRect();

    const mouseData = canvas[Symbol.for('mouseData')];

    const point = [clientX - left, clientY - top, mouseData.state];

    mouseData.x = point[0];
    mouseData.y = point[1];

    const points = canvas[Symbol.for('mousePoints')];

    points.push(point);

    //Store the last 100 stored positions for hover detection
    if (points.length > 100) {
      points.splice(0, points.length - 100);
    }

    evt.preventDefault();
    return false;
  };

  //Up target needs to detect mouse up and keyup events if the mouse leaves the canvas
  const upTarget = typeof window !== 'undefined' ? window : canvas;

  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('mousedown', evt => {
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

  canvas.addEventListener('keydown', evt => {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = true;
    evt.preventDefault();
    return false;
  });

  upTarget.addEventListener('mouseup', evt => {
    const mouseData = canvas[Symbol.for('mouseData')];
    mouseData.state = false;
    mouseMove(evt);
  });

  upTarget.addEventListener('keyup', evt => {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = false;
    evt.preventDefault();
  });
};

const keyData = ctx => ctx.canvas[Symbol.for('keyData')];

var lineCapCall = stackable('lineCap');

var lineDashCall = stackable('lineDash');

var lineDashOffsetCall = stackable('lineDashOffset');

var lineJoinCall = stackable('lineJoin');

var lineWidthCall = stackable('lineWidth');

var miterLimitCall = stackable('miterLimit');

function lineStyle(props, ...children) {
  children = props.lineCap ? lineCapCall(props.lineCap, children) : children;
  children = props.lineDash ? lineDashCall(props.lineDash, children) : children;
  children =
    props.lineDashOffset == null ? children : lineDashOffsetCall(props.lineDashOffset, children);
  children = props.lineJoin ? lineJoinCall(props.lineJoin, children) : children;
  children = props.lineWidth == null ? children : lineWidthCall(props.lineWidth, children);
  return props.miterLimit == null ? children : miterLimitCall(props.miterLimit, children);
}

const pointInstruction = name => (x, y) =>
  new Instruction('call', {
    name,
    args: [x, y],
    count: 2,
  });

var lineTo = pointInstruction('lineTo');

const mouseData = ctx => ctx.canvas[Symbol.for('mouseData')];

var moveTo = pointInstruction('moveTo');

function moveToLineTo(point, index) {
  return index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);
}

function path(...children) {
  return [beginPath(), children, closePath()];
}

const quadraticCurveTo = (cpx, cpy, x, y) =>
  new Instruction('call', {
    name: 'quadraticCurveTo',
    args: [cpx, cpy, x, y],
    count: 4,
  });

const raf = func => {
  const funcCaller = function() {
    requestAnimationFrame(funcCaller);
    return func();
  };

  requestAnimationFrame(funcCaller);
};

var rect = rectInstruction('rect');

const removeRegion = id => new Instruction('removeRegion', { id });

function cycleMouseData(ctx) {
  const mouseData = ctx.canvas[Symbol.for('mouseData')];
  if (mouseData) {
    mouseData.dx = mouseData.x - mouseData.previousX;
    mouseData.dy = mouseData.y - mouseData.previousY;

    mouseData.previousX = mouseData.x;
    mouseData.previousY = mouseData.y;

    mouseData.clicked = 0;
  }
}

const setTransformOperation = (transformStack, transformStackIndex, matrix) => {
  transformStack[transformStackIndex - 6] = matrix[0];
  transformStack[transformStackIndex - 5] = matrix[1];
  transformStack[transformStackIndex - 4] = matrix[2];
  transformStack[transformStackIndex - 3] = matrix[3];
  transformStack[transformStackIndex - 2] = matrix[4];
  transformStack[transformStackIndex - 1] = matrix[5];
};

const scaleOperation = (transformStack, transformStackIndex, matrix, props) => {
  transformStack[transformStackIndex - 6] = matrix[0] * props.x;
  transformStack[transformStackIndex - 5] = matrix[1] * props.x;
  transformStack[transformStackIndex - 4] = matrix[2] * props.y;
  transformStack[transformStackIndex - 3] = matrix[3] * props.y;
  transformStack[transformStackIndex - 2] = matrix[4];
  transformStack[transformStackIndex - 1] = matrix[5];
};

function translateOperation(transformStack, transformStackIndex, matrix, props) {
  transformStack[transformStackIndex - 6] = matrix[0];
  transformStack[transformStackIndex - 5] = matrix[1];
  transformStack[transformStackIndex - 4] = matrix[2];
  transformStack[transformStackIndex - 3] = matrix[3];
  transformStack[transformStackIndex - 2] = matrix[4] + matrix[0] * props.x + matrix[2] * props.y;
  transformStack[transformStackIndex - 1] = matrix[5] + matrix[1] * props.x + matrix[3] * props.y;
}

const rotateOperation = (transformStack, transformStackIndex, matrix, props) => {
  transformStack[transformStackIndex - 6] = matrix[0] * props.cos + matrix[2] * props.sin;
  transformStack[transformStackIndex - 5] = matrix[1] * props.cos + matrix[3] * props.sin;
  transformStack[transformStackIndex - 4] = matrix[0] * -props.sin + matrix[2] * props.cos;
  transformStack[transformStackIndex - 3] = matrix[1] * -props.sin + matrix[3] * props.cos;
  transformStack[transformStackIndex - 2] = matrix[4];
  transformStack[transformStackIndex - 1] = matrix[5];
};

const skewXOperation = (transformStack, transformStackIndex, matrix, props) => {
  transformStack[transformStackIndex - 6] = matrix[0];
  transformStack[transformStackIndex - 5] = matrix[1];
  transformStack[transformStackIndex - 4] = matrix[0] * props.x + matrix[2];
  transformStack[transformStackIndex - 3] = matrix[1] * props.x + matrix[3];
  transformStack[transformStackIndex - 2] = matrix[4];
  transformStack[transformStackIndex - 1] = matrix[5];
};

const skewYOperation = (transformStack, transformStackIndex, matrix, props) => {
  transformStack[transformStackIndex - 6] = matrix[2] * props.y + matrix[0];
  transformStack[transformStackIndex - 5] = matrix[3] * props.y + matrix[1];
  transformStack[transformStackIndex - 4] = matrix[2];
  transformStack[transformStackIndex - 3] = matrix[3];
  transformStack[transformStackIndex - 2] = matrix[4];
  transformStack[transformStackIndex - 1] = matrix[5];
};

function createVirtualStack() {
  return {
    fillStyle: [],
    strokeStyle: [],
    globalCompositeOperation: [],
    imageSmoothingEnabled: [],
    font: [],
    textAlign: [],
    textBaseline: [],
    direction: [],
    shadowBlur: [],
    shadowColor: [],
    shadowOffsetX: [],
    shadowOffsetY: [],
    lineCap: [],
    lineDash: [],
    lineDashOffset: [],
    lineJoin: [],
    miterLimit: [],
    lineWidth: [],
    globalAlpha: [],
  };
}

//Transform points function
//Initialize all the properties
const identity = [1, 0, 0, 1, 0, 0];
const empty$1 = [];
const concat$1 = [].concat;

const relativeTransforms = {
  transform: true,
  scale: true,
  rotate: true,
  translate: true,
  skewX: true,
  skewY: true,
};

const upTransforms = {
  transform: true,
  scale: true,
  rotate: true,
  translate: true,
  skewX: true,
  skewY: true,
  setTransform: true,
};

const hasCurrentTransform = CanvasRenderingContext2D.prototype.hasOwnProperty('currentTransform');

const render = (...args) => {
  let children = args.slice(0, -1),
    isTransformDirty = true,
    transformStackIndex = 6,
    transformStack = new Float64Array(51 * 6),
    cache;

  const ctx = args[args.length - 1];

  cycleMouseData(ctx);
  if (hasCurrentTransform) {
    const { currentTransform } = ctx;
    transformStack.set([
      currentTransform.a,
      currentTransform.b,
      currentTransform.c,
      currentTransform.d,
      currentTransform.e,
      currentTransform.f,
    ]);
  } else {
    transformStack.set(identity);
  }

  const matrix = new Float64Array(identity),
    regions = ctx.canvas[Symbol.for('regions')],
    mousePoints = (ctx.canvas[Symbol.for('mousePoints')] = []),
    extensions = ctx.canvas[Symbol.for('extensions')];

  const stack = createVirtualStack();
  let currentPath = [];

  let len = children.length;

  //Flatten children during the loop process to save time
  for (let i = 0; i < len; i++) {
    let child = children[i];

    //Used to detect if item is an array. Array.isArray is too slow
    if (child && child.constructor === Array) {
      children = concat$1.apply(empty$1, children);
      child = children[i];

      //Repeat as necessary
      while (child && child.constructor === Array) {
        children = concat$1.apply(empty$1, children);
        child = children[i];
      }

      //Used to reset the length.
      len = children.length;
    }

    //Child must be truthy
    if (!child) {
      continue;
    }

    //Child is an instruction at this point, retrieve the props.
    const { props, type } = child;

    //If the transform is relative, then we store the current transform state in matrix.
    if (relativeTransforms[type]) {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];
    }

    if (upTransforms[type]) {
      //Increase the index
      transformStackIndex += 6;

      //We are changing the state of the stack, set the dirty flag
      isTransformDirty = true;
      if (transformStackIndex >= transformStack.length) {
        cache = transformStack;
        transformStack = new Float64Array(transformStack.length + 600); //Add 100 more
        transformStack.set(cache);
      }
    }

    switch (type) {
      case 'transform':
        transform(transformStack, transformStackIndex, matrix, props);
        continue;

      case 'setTransform':
        setTransformOperation(transformStack, transformStackIndex, props);
        continue;

      case 'scale':
        scaleOperation(transformStack, transformStackIndex, matrix, props);
        continue;

      case 'translate':
        translateOperation(transformStack, transformStackIndex, matrix, props);
        continue;

      case 'rotate':
        rotateOperation(transformStack, transformStackIndex, matrix, props);
        continue;

      case 'skewX':
        skewXOperation(transformStack, transformStackIndex, matrix, props);
        continue;

      case 'skewY':
        skewYOperation(transformStack, transformStackIndex, matrix, props);
        continue;

      case 'restore':
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
        transformStack[transformStackIndex - 1],
      );
      currentPath.push(
        new Instruction('call', {
          name: 'setTransform',
          args: [
            transformStack[transformStackIndex - 6],
            transformStack[transformStackIndex - 5],
            transformStack[transformStackIndex - 4],
            transformStack[transformStackIndex - 3],
            transformStack[transformStackIndex - 2],
            transformStack[transformStackIndex - 1],
          ],
          count: 6,
        }),
      );
    }

    switch (type) {
      case 'push':
        stack[props.stack].push(props.stack === 'lineDash' ? ctx.getLineDash() : ctx[props.stack]);

        if (props.stack === 'globalAlpha') {
          ctx[props.stack] *= props.value;
        } else if (props.stack === 'lineDash') {
          ctx.setLineDash(props.value);
        } else {
          ctx[props.stack] = props.value;
        }
        continue;

      case 'pop':
        if (props.stack === 'lineDash') {
          ctx.setLineDash(stack.lineDash.pop());
          continue;
        }

        ctx[props.stack] = stack[props.stack].pop();
        continue;

      case 'call':
        if (name === 'beginPath') {
          currentPath = [];
        } else {
          currentPath.push(child);
        }
        call(ctx, child);
        continue;

      case 'strokeArc':
      case 'fillArc':
        currentPath = currentPath.length > 0 ? [] : currentPath;
        ctx.beginPath();
        ctx.arc(props[0], props[1], props[2], props[3], props[4], props[5]);
        type === 'strokeArc' ? ctx.stroke() : ctx.fill();
        continue;

      case 'removeRegion':
        regions[props.id] = null;
        continue;

      case 'clearRegions':
        for (const region of Object.values(regions)) {
          regions[region.id] = null;
        }
        continue;

      case 'hitRect':
      case 'hitPolygon':
      case 'hitCircle':
      case 'hitRegion':
        if (regions) {
          regions[props.id] = {
            id: props.id,
            points: type === 'hitRegion' ? currentPath.slice() : props.points,
            matrix:
              type === 'hitRegion'
                ? identity
                : [
                    transformStack[transformStackIndex - 6],
                    transformStack[transformStackIndex - 5],
                    transformStack[transformStackIndex - 4],
                    transformStack[transformStackIndex - 3],
                    transformStack[transformStackIndex - 2],
                    transformStack[transformStackIndex - 1],
                  ],
            type, //Hit type goes here
            fillRule: props.fillRule,
            hover: false,
            touched: false,
            clicked: false,
          };
        }
        continue;

      default:
        if (extensions && extensions[type]) {
          extensions[type](props, ctx);
        }
        continue;
    }
  }

  const newRegions = (ctx.canvas[Symbol.for('regions')] = {});
  for (const region of Object.values(regions)) {
    if (region) {
      newRegions[region.id] = region;
    }
  }
};

const end$1 = new Instruction('restore');

const setTransform = (matrix, ...children) => [
  new Instruction('setTransform', [
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5],
  ]),
  children,
  end$1,
];

const resetTransform = (...children) => setTransform([1, 0, 0, 1, 0, 0], children);

const end$2 = new Instruction('restore');

const rotate = (r, ...children) => [
  new Instruction('rotate', { cos: Math.cos(r), sin: Math.sin(r) }),
  children,
  end$2,
];

const end$3 = new Instruction('restore');

const scale = (x, y, ...children) => {
  if (typeof y !== 'number') {
    children = [y].concat(children);
    y = x;
  }

  return [new Instruction('scale', { x, y }), children, end$3];
};

var shadowBlurCall = stackable('shadowBlur');

var shadowColorCall = stackable('shadowColor');

var shadowOffsetXCall = stackable('shadowOffsetX');

var shadowOffsetYCall = stackable('shadowOffsetY');

const shadowStyle = ({ shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY }, ...children) => {
  children = shadowBlur ? shadowBlurCall(children) : children;
  children = shadowColor ? shadowColorCall(children) : children;
  children = shadowOffsetX ? shadowOffsetXCall(children) : children;
  return shadowOffsetY ? shadowOffsetYCall(children) : children;
};

const end$4 = new Instruction('restore');

const skewX = (x, ...children) => [new Instruction('skewX', { x: Math.tan(x) }), children, end$4];

const end$5 = new Instruction('restore');

const skewY = (y, ...children) => [new Instruction('skewY', { y: Math.tan(y) }), children, end$5];

var stroke = emptyCall('stroke');

const fillArc$2 = (...args) => {
  const props = [0, 0, args[0], 0, Tau, false];

  if (args.length > 3) {
    props[3] = args[3];
    props[4] = args[4];
    props[5] = !!args[5];
  }

  if (args.length >= 2) {
    props[0] = args[0];
    props[1] = args[1];
    props[2] = args[2];
  }

  return new Instruction('strokeArc', props);
};

var strokeRect = rectInstruction('strokeRect');

var strokeStyle = stackable('strokeStyle');

var strokeText = textInstruction('strokeText');

var textAlignCall = stackable('textAlign');

var textBaselineCall = stackable('textBaseline');

function textStyle(props, ...children) {
  children = props.font ? fontCall(props.font, children) : children;
  children = props.textAlign ? textAlignCall(props.textAlign, children) : children;
  children = props.textBaseline ? textBaselineCall(props.textBaseline, children) : children;
  return props.direction ? directionCall(props.direction, children) : children;
}

const end$6 = new Instruction('restore');

function transform$1(values, ...children) {
  return [
    new Instruction('transform', [
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5],
    ]),
    children,
    end$6,
  ];
}

const end$7 = new Instruction('restore');

function translate(x, y, ...children) {
  return [new Instruction('translate', { x, y }), children, end$7];
}

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
  direction: directionCall,
  drawImage,
  ellipse,
  endClip,
  extend,
  fill,
  fillArc,
  fillRect,
  fillStyle,
  fillText,
  font: fontCall,
  globalAlpha,
  globalCompositeOperation,
  hitCircle,
  hitRect,
  hitPolygon,
  hitRegion,
  imageSmoothingEnabled,
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
  removeRegion,
  render,
  resetTransform,
  rotate,
  scale,
  setTransform,
  shadowBlur: shadowBlurCall,
  shadowColor: shadowColorCall,
  shadowOffsetX: shadowOffsetXCall,
  shadowOffsetY: shadowOffsetYCall,
  shadowStyle,
  skewX,
  skewY,
  stroke,
  strokeArc: fillArc$2,
  strokeRect,
  strokeStyle,
  strokeText,
  textAlign: textAlignCall,
  textBaseline: textBaselineCall,
  textStyle,
  transform: transform$1,
  transformPoints,
  translate,
};

return index;

})));
