(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["e2d"] = factory();
	else
		root["e2d"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 64);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

class Instruction {
  constructor(type, props) {
    this.type = type;
    this.props = props;
    return Object.seal(this);
  }
}

Object.seal(Instruction);
Object.seal(Instruction.prototype);

module.exports = Instruction;


/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = {
  transform: 0,
  setTransform: 1,
  scale: 2,
  translate: 3,
  rotate: 4,
  skewX: 5,
  skewY: 6,
  restore: 7,
  fillRect: 8,
  strokeRect: 9,
  clearRect: 10,
  rect: 11,
  fillStyle: 12,
  strokeStyle: 13,
  endFillStyle: 14,
  endStrokeStyle: 15,
  lineStyle: 16,
  endLineStyle: 17,
  textStyle: 18,
  endTextStyle: 19,
  shadowStyle: 20,
  endShadowStyle: 21,
  fillText: 22,
  strokeText: 23,
  fillArc: 24,
  strokeArc: 25,
  arc: 26,
  ellipse: 27,
  globalCompositeOperation: 28,
  endGlobalCompositeOperation: 29,
  fill: 30,
  stroke: 31,
  beginClip: 32,
  clip: 33,
  endClip: 34,
  beginPath: 35,
  closePath: 36,
  globalAlpha: 37,
  endGlobalAlpha: 38,
  hitRect: 39,
  hitRegion: 40,
  moveTo: 41,
  lineTo: 42,
  bezierCurveTo: 43,
  quadraticCurveTo: 44,
  imageSmoothingEnabled: 45,
  endImageSmoothingEnabled: 46,
  custom: 47,
  arcTo: 48
};

/***/ },
/* 2 */
/***/ function(module, exports) {

let transformPoints = (points, matrix) => {
  let result = [],
      x, y;

  for(let i = 0; i < points.length; i++) {
    [x, y] = points[i];
    result.push([
      matrix[0] * x + matrix[2] * y + matrix[4],
      matrix[1] * x + matrix[3] * y + matrix[5]
    ]);
  }
  return result;
};

module.exports = transformPoints;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0),
  cache = new Instruction('beginPath');

let beginPath = () => cache;

module.exports = beginPath;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let cache = new Instruction('closePath');

let closePath = () => cache;

module.exports = closePath;


/***/ },
/* 5 */
/***/ function(module, exports) {


let cycleMouseData = (ctx) => {
  let mouseData = ctx.canvas[Symbol.for('mouseData')];
  if (mouseData) {
    mouseData.dx = mouseData.x - mouseData.previousX;
    mouseData.dy = mouseData.y - mouseData.previousY;

    mouseData.previousX = mouseData.x;
    mouseData.previousY = mouseData.y;

    mouseData.clicked = 0;
  }
};

module.exports = cycleMouseData;

/***/ },
/* 6 */
/***/ function(module, exports) {

let det = 0;
let invertMatrix = ([a, b, c, d, e, f]) => (
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
 module.exports = invertMatrix;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let lineTo = (x, y) => new Instruction('lineTo', { x, y });

module.exports = lineTo;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let moveTo = (x, y) => new Instruction('moveTo', { x, y });

module.exports = moveTo;


/***/ },
/* 9 */
/***/ function(module, exports) {

let pointInRect = ([px, py], [[x, y], [width, height]]) => px > x && py > y && px < width && py < height;

module.exports = pointInRect;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('restore');

let setTransform = (matrix, ...children) => [
  new Instruction('setTransform', [
    matrix[0],
    matrix[1],
    matrix[2],
    matrix[3],
    matrix[4],
    matrix[5]
  ]),
  children,
  end
];

module.exports = setTransform;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

var map = {
	"./Instruction.js": 0,
	"./activeRegions.js": 16,
	"./arc.js": 17,
	"./arcTo.js": 18,
	"./beginPath.js": 3,
	"./bezierCurveTo.js": 19,
	"./clearRect.js": 20,
	"./clip.js": 21,
	"./clipPath.js": 22,
	"./closePath.js": 4,
	"./consts.js": 1,
	"./createRegularPolygon.js": 23,
	"./createWrapper.js": 24,
	"./cycleMouseData.js": 5,
	"./deserialize.js": 25,
	"./drawImage.js": 26,
	"./ellipse.js": 27,
	"./fill.js": 28,
	"./fillArc.js": 29,
	"./fillRect.js": 30,
	"./fillStyle.js": 31,
	"./fillText.js": 32,
	"./globalAlpha.js": 33,
	"./globalCompositeOperation.js": 34,
	"./hitRect.js": 35,
	"./hitRegion.js": 36,
	"./imageSmoothingEnabled.js": 37,
	"./initialize.js": 38,
	"./invertMatrix.js": 6,
	"./keyData.js": 39,
	"./lineStyle.js": 40,
	"./lineTo.js": 7,
	"./mouseData.js": 41,
	"./moveTo.js": 8,
	"./moveToLineTo.js": 42,
	"./path.js": 43,
	"./placeHolder.js": 44,
	"./pointInRect.js": 9,
	"./quadraticCurveTo.js": 45,
	"./raf.js": 46,
	"./rect.js": 47,
	"./render.js": 48,
	"./resetTransform.js": 49,
	"./rotate.js": 50,
	"./scale.js": 51,
	"./serialize.js": 52,
	"./setTransform.js": 10,
	"./shadowStyle.js": 53,
	"./skewX.js": 54,
	"./skewY.js": 55,
	"./stroke.js": 56,
	"./strokeArc.js": 57,
	"./strokeRect.js": 58,
	"./strokeStyle.js": 59,
	"./strokeText.js": 60,
	"./textStyle.js": 61,
	"./transform.js": 62,
	"./transformPoints.js": 2,
	"./translate.js": 63
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 12;


/***/ },
/* 13 */
/***/ function(module, exports) {

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
    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
    if (hasKeyCode) searchInput = hasKeyCode
  }

  // Numbers
  if ('number' === typeof searchInput) return names[searchInput]

  // Everything else (cast to string)
  var search = String(searchInput)

  // check codes
  var foundNamedKey = codes[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // check aliases
  var foundNamedKey = aliases[search.toLowerCase()]
  if (foundNamedKey) return foundNamedKey

  // weird character?
  if (search.length === 1) return search.charCodeAt(0)

  return undefined
}

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
}

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
}


/*!
 * Programatically add the following
 */

// lower case chars
for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
for (i = 1; i < 13; i++) codes['f'+i] = i + 111

// numpad keys
for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

/**
 * Get by code
 *
 *   exports.name[13] // => 'Enter'
 */

var names = exports.names = exports.title = {} // title for backward compat

// Create reverse mapping
for (i in codes) names[codes[i]] = i

// Add aliases
for (var alias in aliases) {
  codes[alias] = aliases[alias]
}


/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = function (point, vs) {
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


/***/ },
/* 15 */
/***/ function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

let pointInPolygon = __webpack_require__(14);
let transformPoints = __webpack_require__(2);
let invertMatrix = __webpack_require__(6);
let pointInRect = __webpack_require__(9);

let matrix = new Float64Array(6);

module.exports = (ctx) => {
  let regions = ctx.canvas[Symbol.for('regions')],
    mousePoints = ctx.canvas[Symbol.for('mousePoints')],
    mouseData = ctx.canvas[Symbol.for('mouseData')],
    results = {};

  //the mouse might have held still, add the current mouse position
  if (mousePoints.length === 0) {
    mousePoints.push([mouseData.x, mouseData.y, mouseData.state]);
  }

  for(let region of regions) {

    //invert the region matrix and transform the mouse points
    let transformedMousePoints = transformPoints(mousePoints, invertMatrix(region.matrix));
    //the mouse points are now relative to the mouse region

    if (!region.polygon) {
      for (let mousePoint of transformedMousePoints) {
        if (pointInRect(mousePoint, region.points)) {
          region.hover = true;
          region.clicked = !!mouseData.clicked;
          results[region.id] = region;
          break;
        }
      }
      continue;
    }

    //loop over each point until one is matched
    for(let mousePoint of transformedMousePoints) {
      if (pointInPolygon(mousePoint, region.points)) {
        region.hover = true;
        region.clicked = !!mouseData.clicked;
        results[region.id] = region;
        break;
      }
    }
  }
  return results;
};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

let arc = (...args) => {
  let  [x, y, r, startAngle, endAngle, counterclockwise] = args;
  let props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };


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

  return new Instruction("arc",  props);
};

module.exports = arc;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let arcTo = (x1, y1, x2, y2, r) => new Instruction('arcTo', { x1, y1, x2, y2, r });

module.exports = arcTo;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => new Instruction('bezierCurveTo', {
  cp1x,
  cp1y,
  cp2x,
  cp2y,
  x,
  y
});


module.exports = bezierCurveTo;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let clearRect = (...args) => new Instruction('clearRect',
  args.length > 2 ?
    { x: args[0], y: args[1], width: args[2], height: args[3] } :
    { x: 0, y: 0, width: args[0], height: args[1] }
);


module.exports = clearRect;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let begin = new Instruction('beginClip'),
  performClip = new Instruction('clip'),
  end = new Instruction('endClip');

let clip = (path, ...children) => [
  begin,
  path,
  performClip,
  children,
  end
];

module.exports = clip;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let cache = new Instruction('clipPath');

let clipPath = () => cache;

module.exports = clipPath;


/***/ },
/* 23 */
/***/ function(module, exports) {

let createRegularPolygon = (radius = 0, position = [0, 0], sides = 3) => {
  let polygon = [];
  for(let i = 0; i < sides; i++) {
    polygon.push([
      position[0] + radius * Math.cos(Math.PI * 2 * i / sides),
      position[1] + radius * Math.sin(Math.PI * 2 * i / sides)
    ]);
  }
  return polygon;
};

module.exports = createRegularPolygon;


/***/ },
/* 24 */
/***/ function(module, exports) {

let concat = [].concat;

let createWrapper = (...args) => {
  for(let i = 0; i < args.length; i++) {
    //parse and flatten the arguments
    while (args[i] && args[i].constructor === Array) {
      args = concat.apply([], args).filter(Boolean);
    }

    if (!args[i]) {
      continue;
    }

    let { type } = args[i];
    if (type === 'placeholder') {
      // i is set to the placeholder index now

      //now grab all the elements to the left of the placeHolder
      let left = args.splice(0, i);

      //remove the placeHolder from the array
      args.shift();

      return (...children) => [left, children, args];
    }
  }

  throw new Error('Could not find placeholder, did you forget the e2d.placeHolder() call?');
};

module.exports = concat;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

let consts = __webpack_require__(1);
let Instruction = __webpack_require__(0);

//property indexes
let lineCapProps = ['butt', 'round', 'square'];
let lineJoinProps = ['bevel', 'round', 'miter'];
let textBaselineProps = ["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"];
let textAlignProps = ["left", "right", "center", "start", "end"];
let directionProps = ["ltr", "rtl", "inherit"];
let globalCompositeOperationProps = [
  "source-over","source-in", "source-out",
  "source-atop", "destination-over", "destination-in",
  "destination-out", "destination-atop", "lighter",
  "copy", "xor", "multiply",
  "screen", "overlay", "darken",
  "lighten", "color-dodge", "color-burn",
  "hard-light", "soft-light", "difference",
  "exclusion", "hue", "saturation",
  "color", "luminosity"
];

let rects = {
  [consts.fillRect]: 'fillRect',
  [consts.strokeRect]: 'strokeRect',
  [consts.clearRect]: 'clearRect',
  [consts.rect]: 'rect'
};

let texts = {
  [consts.fillText]: 'fillText',
  [consts.strokeText]: 'strokeText',
};

let arcs = {
  [consts.fillArc]: 'fillArc',
  [consts.strokeArc]: 'strokeArc',
  [consts.arc]: 'arc'
};

let emptyInstructions = {
  [consts.endFillStyle]: 'endFillStyle',
  [consts.endLineStyle]: 'endLineStyle',
  [consts.endStrokeStyle]: 'endStrokeStyle',
  [consts.endLineStyle]: 'endLineStyle',
  [consts.endShadowStyle]: 'endShadowStyle',
  [consts.endTextStyle]: 'endTextStyle',
  [consts.restore]: 'restore',
  [consts.endGlobalCompositeOperation]: 'endGlobalCompositeOperation',
  [consts.fill]: 'fill',
  [consts.stroke]: 'stroke',
  [consts.beginClip]: 'beginClip',
  [consts.clip]: 'clip',
  [consts.endClip]: 'endClip',
  [consts.beginPath]: 'beginPath',
  [consts.closePath]: 'closePath',
  [consts.endGlobalAlpha]: 'endGlobalAlpha',
  [consts.endImageSmoothingEnabled]: 'endImageSmoothingEnabled'
};

let points = {
  [consts.moveTo]: 'moveTo',
  [consts.lineTo]: 'lineTo'
};

let getString = (data, index, length) => {
  let value = '';
  for (let i = 0; i < length; i++) {
    value += String.fromCharCode(data[index + i]);
  }
  return value;
};

let getArray = (data, index, length) => {
  let value = [];
  for(let i = 0; i < length; i++) {
    value.push(data[i]);
  }
  return value;
};

let deserialize = (data, custom) => {
  let tree = [];
  for(let i = 0; i < data.length;) {
    let command = data[i];

    if (command === consts.transform) {
      tree.push(
        new Instruction('transform', [
          data[i + 1],
          data[i + 2],
          data[i + 3],
          data[i + 4],
          data[i + 5],
          data[i + 6]
        ])
      );
      i += 7;
      continue;
    }

    if (command === consts.setTransform) {
      tree.push(
        new Instruction('setTransform', [
          data[i + 1],
          data[i + 2],
          data[i + 3],
          data[i + 4],
          data[i + 5],
          data[i + 6]
        ])
      );
      i += 7;
      continue;
    }

    if (command === consts.scale) {
      tree.push(
        new Instruction('scale', { x: data[i + 1], y: data[i + 2] })
      );
      i += 3;
      continue;
    }

    if (command === consts.translate) {
      tree.push(
        new Instruction('translate', { x: data[i + 1], y: data[i + 2] })
      );
      i += 3;
      continue;
    }

    if (command === consts.rotate) {
      tree.push(
        new Instruction('rotate', { cos: data[i + 1], sin: data[i + 2] })
      );
      i += 3;
      continue;
    }

    if (command === consts.skewX) {
      tree.push(
        new Instruction('skewX', { x: data[i + 1] })
      );
      i += 2;
      continue;
    }

    if (command === consts.skewY) {
      tree.push(
        new Instruction('skewY', { y: data[i + 1] })
      );
      i += 2;
      continue;
    }

    if (rects[command]) {
      tree.push(
        new Instruction(rects[command], {
          x: data[i + 1],
          y: data[i + 2],
          width: data[i + 3],
          height: data[i + 4]
        })
      );
      i += 5;
      continue;
    }

    if (command === consts.fillStyle || command === consts.strokeStyle) {
      let length = data[i + 1];

      let value = getString(data, i + 2, length);

      tree.push(
        new Instruction(command === consts.fillStyle ? 'fillStyle' : 'strokeStyle', { value })
      );
      //advance the parser to the next instruction
      i += 2 + length;
      continue;
    }



    if (command === consts.lineStyle) {
      tree.push(
        new Instruction('lineStyle', {
          lineWidth: !isNaN(data[i + 1]) ? data[i + 1] : null,
          lineCap: !isNaN(data[i + 2]) ? lineCapProps[data[i + 2]] || null : null,
          lineJoin: !isNaN(data[i + 3]) ? lineCapProps[data[i + 3]] || null : null,
          miterLimit: !isNaN(data[i + 4]) ? data[i + 4] : null,
          lineDash: !isNaN(data[i + 6]) ? getArray(data, i + 7, data[i + 6]) : null,
          lineDashOffset: !isNaN(data[i + 5]) ? data[i + 5] : null
        })
      );
      i += 7 + (!isNaN(data[i + 6]) ? data[i + 6]: 0);
      continue;
    }

    if (command === consts.textStyle) {
      tree.push(
        new Instruction('textStyle', {
          font: !isNaN(data[i + 4]) ? getString(data, i + 5, data[i + 4]) : null,
          textAlign: !isNaN(data[i + 1]) ? textAlignProps[data[i + 1]] || null : null,
          textBaseline: !isNaN(data[i + 2]) ? textBaselineProps[data[i + 2]] || null : null,
          direction: !isNaN(data[i + 3]) ? directionProps[data[i + 3]] || null : null,
        })
      );
      i += 5 + (!isNaN(data[i + 4]) ? data[i + 4] : 0);
      continue;
    }

    if (command === consts.shadowStyle) {
      tree.push(
        new Instruction('shadowStyle', {
          shadowBlur: !isNaN(data[i + 1]) ? data[i + 1] : null,
          shadowColor: !isNaN(data[i + 4]) ? getString(data, i + 5, data[i + 4]) : null,
          shadowOffsetX : !isNaN(data[i + 2]) ? data[i + 2] : null,
          shadowOffsetY: !isNaN(data[i + 3]) ? data[i + 3] : null,
        })
      );
      i += 5 + (!isNaN(data[i + 4]) ? data[i + 4] : 0);
      continue;
    }

    if (texts[command]) {
      tree.push(
        new Instruction(texts[command], {
          text: !isNaN(data[i + 4]) ? getString(data, i + 5, data[i + 4]) : '',
          x: data[i + 1],
          y: data[i + 2],
          maxWidth: !isNaN(data[i + 3]) ? data[i + 3] : null
        })
      );
      i += 5 + (!isNaN(data[i + 4]) ? data[i + 4] : 0);
      continue;
    }

    if (command === consts.arcTo) {
      tree.push(
        new Instruction('arcTo', {
          x1: data[i + 1],
          y1: data[i + 2],
          x2: data[i + 3],
          y2: data[i + 4],
          r: data[i + 5]
        })
      );
      i += 6;
      continue;
    }

    if (arcs[command]) {
      tree.push(
        new Instruction(arcs[command], {
          x: data[i + 1],
          y: data[i + 2],
          r: data[i + 3],
          startAngle: data[i + 4],
          endAngle: data[i + 5],
          counterclockwise: !!data[i + 6]
        })
      );
      i += 7;
      continue;
    }

    if (command === consts.ellipse) {
      tree.push(
        new Instruction('ellipse', {
          x: data[i + 1],
          y: data[i + 2],
          radiusX: data[i + 3],
          radiusY: data[i + 4],
          rotation: data[i + 5],
          startAngle: data[i + 6],
          endAngle: data[i + 7],
          anticlockwise: !!data[i + 8]
        })
      );
      i += 9;
      continue;
    }

    if (command === consts.globalCompositeOperation) {
      tree.push(
        new Instruction('globalCompositeOperation', {
          value: globalCompositeOperationProps[data[i + 1]]
        })
      );
      i += 2;
      continue;
    }

    if (command === consts.hitRect) {
      tree.push(
        new Instruction('hitRect', {
          id: getString(data, i + 6, data[i + 5]),
          points: [
            [data[i + 1], data[i + 2]],
            [data[i + 3], data[i + 4]],
          ]
        })
      );
      i += 6 + data[i + 5];
      continue;
    }

    if (command === consts.hitRegion) {
      let points = [], len = data[i + 1];
      for(let j = 0; j < len; j++) {
        i += 2;
        points.push(
          [data[i], data[i + 1]]
        );
      }
      i += 2;
      tree.push(
        new Instruction('hitRegion', {
          id: getString(data, i + 1, data[i]),
          points
        })
      );
      i += 1 + data[i];
      continue;
    }

    if (points[command]) {
      tree.push(
        new Instruction(points[command], { x: data[i + 1], y: data[i + 2] })
      );
      i += 3;
      continue;
    }

    if (command === consts.bezierCurveTo) {
      tree.push(
        new Instruction('bezierCurveTo', {
          cp1x: data[i + 1],
          cp1y: data[i + 2],
          cp2x: data[i + 3],
          cp2y: data[i + 4],
          x: data[i + 5],
          y: data[i + 6]
        })
      );
      i += 7;
      continue;
    }

    if (command === consts.quadraticCurveTo) {
      tree.push(
        new Instruction('quadraticCurveTo', {
          cpx: data[i + 1],
          cpy: data[i + 2],
          x: data[i + 3],
          y: data[i + 4]
        })
      );
      i += 5;
      continue;
    }

    if (command === consts.imageSmoothingEnabled) {
      tree.push(
        new Instruction('imageSmoothingEnabled', {
          value: !!data[i + 1]
        })
      );
      i += 2;
      continue;
    }

    if (emptyInstructions[command]) {
      tree.push(
        new Instruction(emptyInstructions[command])
      );
      i += 1;
      continue;
    }

    if (command === consts.custom) {
      if (!custom) {
        throw new Error('Custom command object was falsy, did you forget to provide deserialize methods?');
      }
      let type = getString(data, i + 2, data[i + 1]);
      if (!custom[type]) {
        throw new Error('Custom command serialized but no matching deserialize method provided.');
      }

      i += 2 + data[i + 1];

      //data[i] is count
      //data[i + 1] is first element
      tree.push(
        new Instruction(type,
          custom[type](
            data.slice(i + 1, i + 1 + data[i])
          )
        )
      );
      i += 1 + data[i];
    }
  }

  return tree;
};

module.exports = deserialize;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let drawImage = (...args) => {
  let [img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight] = args;

  if (args.length === 9) {
    return new Instruction('drawImageSource', {
      img,
      sx,
      sy,
      sWidth,
      sHeight,
      dx,
      dy,
      dWidth,
      dHeight
    });
  }

  if (args.length >= 5) {
    return new Instruction('drawImageSize', {
      img,
      dx: sx,
      dy: sy,
      dWidth: sWidth,
      dHeight: sHeight
    });
  }

  if (args.length >= 3) {
    return new Instruction('drawImage', {
      img,
      dx: sx,
      dy: sy
    });
  }

  return new Instruction('drawImage', {
    img,
    dx: 0,
    dy: 0
  });
};

module.exports = drawImage;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

let ellipse = (...args) => {
  let [x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise] = args;

  let props = { x: 0, y: 0, radiusX: x, radiusY: y, rotation: 0, startAngle: 0, endAngle: pi2, anticlockwise: false };

  if (args.length > 5) {
    props.startAngle = startAngle;
    props.endAngle = endAngle;
    props.anticlockwise = !!anticlockwise;
  }

  if (args.length > 4) {
    props.rotation = rotation;
  }

  if (args.length > 2){
    props.x = x;
    props.y = y;
    props.radiusX = radiusX;
    props.radiusY = radiusY;
  }

  return new Instruction("ellipse",  props);
};

module.exports = ellipse;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let cache = new Instruction('fill');

let fill = () => cache;

module.exports = fill;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {



let Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

let fillArc = (...args) => {
  let [x, y, r, startAngle, endAngle, counterclockwise] = args;
  let props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };


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

module.exports = fillArc;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let fillRect = (...args) => new Instruction('fillRect',
  args.length > 2 ?
    { x: args[0], y: args[1], width: args[2], height: args[3] } :
    { x: 0, y: 0, width: args[0], height: args[1] }
);

module.exports = fillRect;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('endFillStyle');

let fillStyle = (value, ...children) => [
    new Instruction('fillStyle', { value }),
    children,
    end
];

module.exports = fillStyle;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let fillText = (...args) => {
  let [text, x, y, maxWidth] = args;
  if (args.length < 4) {
    maxWidth = null;
  }
  if (args.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('fillText', { text, x, y, maxWidth });
};

module.exports = fillText;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {



let Instruction = __webpack_require__(0);
let end = new Instruction('endGlobalAlpha');

let globalAlpha = (value, ...children) => [
  new Instruction('globalAlpha', { value }),
  children,
  end
];
module.exports = globalAlpha;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {



var Instruction = __webpack_require__(0);

let end = new Instruction('endGlobalCompositeOperation');

let globalCompositeOperation = (value, ...children) => [
  new Instruction('globalCompositeOperation', { value }),
  children,
  end
];

module.exports = globalCompositeOperation;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let hitRect = (id, ...args) => {
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

module.exports = hitRect;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let hitRegion = (id, points) => new Instruction('hitRegion', { id, points });

module.exports = hitRegion;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('endImageSmoothingEnabled');

let imageSmoothingEnabled = (value, ...children) => [
  new Instruction('imageSmoothingEnabled', { value }),
  children,
  end
];
module.exports = imageSmoothingEnabled;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

let keycode = __webpack_require__(13);

module.exports = (ctx) => {
  let { canvas } = ctx;

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

  let keys = canvas[Symbol.for('keyData')] = {};

  for (let name in keycode.code) {
    if (keycode.code.hasOwnProperty(name)) {
      keys[name] = false;
    }
  }

  //mouse regions
  canvas[Symbol.for('regions')] = [];
  canvas[Symbol.for('mousePoints')] = [];

  //make the canvas receive touch and mouse events
  canvas.tabIndex = 1;

  let mouseMove = (evt) => {
    let { clientX, clientY } = evt;
    //get left and top coordinates
    let { left, top } = canvas.getBoundingClientRect();

    let mouseData = canvas[Symbol.for('mouseData')];

    let point = [clientX - left, clientY - top, mouseData.state];

    mouseData.x = point[0];
    mouseData.y = point[1];

    let points = canvas[Symbol.for('mousePoints')];

    points.push(point);

    //store the last 100 stored positions for hover detection
    if (points.length > 100) {
      points.splice(0, points.length - 100);
    }

    evt.preventDefault();
    return false;
  };

  canvas.addEventListener('mousemove', (evt) => mouseMove(evt));
  canvas.addEventListener('mousedown', (evt) => {
    let { target } = evt;
    if (target === canvas) {
      let mouseData = canvas[Symbol.for('mouseData')];

      if (!mouseData.state) {
        mouseData.clicked += 1;
      }

      mouseData.state = true;
      return mouseMove(evt);
    }
  });
  canvas.addEventListener('mouseup', (evt) => {
    let mouseData = canvas[Symbol.for('mouseData')];
    mouseData.state = false;
    return mouseMove(evt);
  });
  canvas.addEventListener('keydown', (evt) => {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = true;
    evt.preventDefault();
    return false;
  });
  canvas.addEventListener('keyup', (evt) => {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = false;
    evt.preventDefault();
    return false;
  });
};

/***/ },
/* 39 */
/***/ function(module, exports) {

module.exports = (ctx) => ctx.canvas[Symbol.for('keyData')];

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('endLineStyle');

let lineStyle = (value, ...children) => {

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
    end
  ];
};

module.exports = lineStyle;


/***/ },
/* 41 */
/***/ function(module, exports) {

module.exports = (ctx) => ctx.canvas[Symbol.for('mouseData')];

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

let moveTo = __webpack_require__(8), lineTo = __webpack_require__(7);

let moveToLineTo = (point, index) => index === 0 ?
  moveTo(point[0], point[1]) :
  lineTo(point[0], point[1]);

module.exports = moveToLineTo;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

let beginPath = __webpack_require__(3)(),
    closePath = __webpack_require__(4)();

let path = (...children) => [
  beginPath,
  children,
  closePath
];

module.exports = path;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let cache = new Instruction('placeholder');
let placeHolder = () => cache;

module.exports = placeHolder;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let quadraticCurveTo = (cpx, cpy, x, y) => new Instruction('quadraticCurveTo', {
  cpx,
  cpy,
  x,
  y
});

module.exports = quadraticCurveTo;


/***/ },
/* 46 */
/***/ function(module, exports) {

let raf = (func) => {
  requestAnimationFrame(() => raf(func));
  return func();
};

module.exports = raf;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let rect = (...args) => new Instruction('rect',
  args.length > 2 ?
    { x: args[0], y: args[1], width: args[2], height: args[3] } :
    { x: 0, y: 0, width: args[0], height: args[1] }
);

module.exports = rect;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {


//initialize all the properties

let identity = [1, 0, 0, 1, 0, 0],
  matrix = new Float64Array(identity),
  fillStyleStack = [],
  strokeStyleStack = [],
  lineStyleStack = [],
  textStyleStack = [],
  shadowStyleStack = [],
  globalCompositeOperationStack = [],
  globalAlphaStack = [],
  imageSmoothingEnabledStack = [],
  transformStack = new Float64Array(501 * 6),
  transformStackIndex = 6,
  concat = [].concat,
  supportsEllipse = false;

if (typeof CanvasRenderingContext2D !== 'undefined') {
  supportsEllipse = CanvasRenderingContext2D.prototype.hasOwnProperty('ellipse');
}

//transform points function
const transformPoints = __webpack_require__(2);
const cycleMouseData = __webpack_require__(5);

const increaseTransformStackSize = () => {
  let cache = transformStack;
  transformStack = new Float64Array(transformStack.length + 600); //add 100 more
  transformStack.set(cache);
  return this;
};

transformStack.set(identity);

const PI2 = Math.PI * 2;

let empty = (target) => target && target.splice(0, target.length);

module.exports = (...args) => {
  let children = args.slice(0, -1),
   ctx = args[args.length - 1];

  let regions = ctx.canvas[Symbol.for('regions')],
    mousePoints = ctx.canvas[Symbol.for('mousePoints')],
    extensions = ctx.canvas[Symbol.for('extensions')];

  let cache;

  cycleMouseData(ctx);

  empty(regions);
  empty(mousePoints);

  let len = children.length;

  //flatten children during the loop process to save cpu
  for (let i = 0; i < len; i++) {
    let child = children[i];

    //flattening algorithm
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

    let { props, type } = child;

    if (type === 'transform') {

      //copy transformStack values to matrix
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      //increase the index
      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

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

      //modify the ctx
      ctx.setTransform(
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      );
      continue;
    }

    if (type === 'setTransform') {
      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = props[0];//a
      transformStack[transformStackIndex - 5] = props[1];//b
      transformStack[transformStackIndex - 4] = props[2];//c
      transformStack[transformStackIndex - 3] = props[3];//d
      transformStack[transformStackIndex - 2] = props[4];//e
      transformStack[transformStackIndex - 1] = props[5];//f
      ctx.setTransform(props[0], props[1], props[2], props[3], props[4], props[5]);

      continue;
    }

    if (type === 'scale') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = matrix[0] * props.x; //a
      transformStack[transformStackIndex - 5] = matrix[1] * props.x; //b
      transformStack[transformStackIndex - 4] = matrix[2] * props.y; //c
      transformStack[transformStackIndex - 3] = matrix[3] * props.y; //d
      transformStack[transformStackIndex - 2] = matrix[4]; //e
      transformStack[transformStackIndex - 1] = matrix[5]; //f

      ctx.setTransform(
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      );

      continue;
    }

    if (type === 'translate') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = matrix[0]; //a
      transformStack[transformStackIndex - 5] = matrix[1]; //b
      transformStack[transformStackIndex - 4] = matrix[2]; //c
      transformStack[transformStackIndex - 3] = matrix[3]; //d
      transformStack[transformStackIndex - 2] = matrix[4] + matrix[0] * props.x + matrix[2] * props.y; //e
      transformStack[transformStackIndex - 1] = matrix[5] + matrix[1] * props.x + matrix[3] * props.y; //f

      ctx.setTransform(
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      );
      continue;
    }

    if (type === 'rotate') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

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

      ctx.setTransform(
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      );
      continue;
    }

    if (type === 'skewX') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] = matrix[0]; //a
      transformStack[transformStackIndex - 5] = matrix[1]; //b
      transformStack[transformStackIndex - 4] = //c
        matrix[0] * props.x + matrix[2];
      transformStack[transformStackIndex - 3] = //d
        matrix[1] * props.x + matrix[3];
      transformStack[transformStackIndex - 2] = matrix[4]; //e
      transformStack[transformStackIndex - 1] = matrix[5]; //f


      ctx.setTransform(
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      );
      continue;
    }

    if (type === 'skewY') {
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      transformStackIndex += 6;
      if (transformStackIndex > transformStack.length) {
        increaseTransformStackSize();
      }

      transformStack[transformStackIndex - 6] =
        matrix[0] * 1 + matrix[2] * props.y; //a
      transformStack[transformStackIndex - 5] =
        matrix[1] * 1 + matrix[3] * props.y; //b
      transformStack[transformStackIndex - 4] = matrix[2]; //c
      transformStack[transformStackIndex - 3] = matrix[3]; //d

      transformStack[transformStackIndex - 2] = matrix[4]; //e
      transformStack[transformStackIndex - 1] = matrix[5]; //f

      ctx.setTransform(
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      );
      continue;
    }

    if (type === 'restore') {
      transformStackIndex -= 6;
      matrix[0] = transformStack[transformStackIndex - 6];
      matrix[1] = transformStack[transformStackIndex - 5];
      matrix[2] = transformStack[transformStackIndex - 4];
      matrix[3] = transformStack[transformStackIndex - 3];
      matrix[4] = transformStack[transformStackIndex - 2];
      matrix[5] = transformStack[transformStackIndex - 1];

      ctx.setTransform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
      continue;
    }

    if (type === 'fillRect') {
      ctx.fillRect(props.x, props.y, props.width, props.height);
      continue;
    }

    if (type === 'strokeRect') {
      ctx.strokeRect(props.x, props.y, props.width, props.height);
      continue;
    }

    if (type === 'clearRect') {
      ctx.clearRect(props.x, props.y, props.width, props.height);
      continue;
    }

    if (type === 'rect') {
      ctx.rect(props.x, props.y, props.width, props.height);
      continue;
    }

    if (type === 'fillStyle') {
      fillStyleStack.push(ctx.fillStyle);
      ctx.fillStyle = props.value;
      continue;
    }

    if (type === 'strokeStyle') {
      strokeStyleStack.push(ctx.strokeStyle);
      ctx.strokeStyle = props.value;
      continue;
    }

    if (type === 'endFillStyle') {
      ctx.fillStyle = fillStyleStack.pop();

      continue;
    }

    if (type === 'endStrokeStyle') {
      ctx.strokeStyle = strokeStyleStack.pop();
      continue;
    }
    if (type === 'lineStyle') {
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
    }

    if (type === 'endLineStyle') {
      cache = lineStyleStack.pop();
      ctx.lineWidth = cache.lineWidth;
      ctx.lineCap = cache.lineCap;
      ctx.lineJoin = cache.lineJoin;
      ctx.miterLimit = cache.miterLimit;
      ctx.setLineDash(cache.lineDash);
      ctx.lineDashOffset = cache.lineDashOffset;
      continue;
    }

    if (type === 'textStyle') {
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
    }

    if (type === 'endTextStyle') {
      cache = textStyleStack.pop();
      ctx.font = cache.font;
      ctx.textAlign = cache.textAlign;
      ctx.textBaseline = cache.textBaseline;
      ctx.direction = cache.direction;
      continue;
    }

    if (type === 'shadowStyle') {
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
    }

    if (type === 'endShadowStyle') {
      cache = shadowStyleStack.pop();
      ctx.shadowBlur = cache.shadowBlur;
      ctx.shadowColor = cache.shadowColor;
      ctx.shadowOffsetX = cache.shadowOffsetX;
      ctx.shadowOffsetY = cache.shadowOffsetY;
      continue;
    }

    if (type === 'strokeText') {
      if (props.maxWidth) {
        ctx.strokeText(props.text, props.x, props.y, props.maxWidth);
        continue;
      }
      ctx.strokeText(props.text, props.x, props.y);
      continue;
    }

    if (type === 'fillText') {
      if (props.maxWidth) {
        ctx.fillText(props.text, props.x, props.y, props.maxWidth);
        continue;
      }
      ctx.fillText(props.text, props.x, props.y);
      continue;
    }

    if (type === 'drawImage') {
      ctx.drawImage(props.img, props.dx, props.dy);
      continue;
    }

    if (type === 'drawImageSize') {
      ctx.drawImage(props.img, props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }

    if (type === 'drawImageSource') {
      ctx.drawImage(props.img, props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);
      continue;
    }

    if (type === 'strokeArc') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.counterclockwise);
      ctx.closePath();
      ctx.stroke();
      continue;
    }

    if (type === 'fillArc') {
      ctx.beginPath();
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.counterclockwise);
      ctx.closePath();
      ctx.fill();
      continue;
    }

    if (type === 'moveTo') {
      ctx.moveTo(props.x, props.y);
      continue;
    }

    if (type === 'lineTo') {
      ctx.lineTo(props.x, props.y);
      continue;
    }

    if (type === 'bezierCurveTo') {
      ctx.bezierCurveTo(props.cp1x, props.cp1y, props.cp2x, props.cp2y, props.x, props.y);
      continue;
    }

    if (type === 'quadraticCurveTo') {
      ctx.quadraticCurveTo(props.cpx, props.cpy, props.x, props.y);
      continue;
    }

    if (type === 'arc') {
      ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.counterclockwise);
      continue;
    }

    if (type === 'arcTo') {
      ctx.arcTo(props.x1, props.y1, props.x2, props.y2, props.r);
      continue;
    }

    if (type === 'ellipse') {
      //if the method is provided by the browser
      if (supportsEllipse) {
        ctx.ellipse(
          props.x,
          props.y,
          props.radiusX,
          props.radiusY,
          props.rotation,
          props.startAngle,
          props.endAngle,
          props.anticlockwise
        );
        continue;
      }
      ctx.save();
      ctx.translate(props.x, props.y);
      ctx.rotate(props.rotation);
      ctx.scale(props.radiusX, props.radiusY);
      ctx.arc(0, 0, 1, props.startAngle, props.endAngle, props.anticlockwise);
      ctx.restore();
      continue;
    }

    if (type === 'globalCompositeOperation') {
      globalCompositeOperationStack.push(ctx.globalCompositeOperation);
      ctx.globalCompositeOperation = props.value;
      continue;
    }

    if (type === 'endGlobalCompositeOperation') {
      ctx.globalCompositeOperation = globalCompositeOperationStack.pop();
      continue;
    }

    if (type === 'fill') {
      ctx.fill();
      continue;
    }

    if (type === 'stroke') {
      ctx.stroke();
      continue;
    }

    if (type === 'beginClip') {
      ctx.save();
      ctx.beginPath();
      continue;
    }

    if (type === 'clip') {
      ctx.clip();
      continue;
    }

    if (type === 'endClip') {
      ctx.restore();
      continue;
    }

    if (type === 'beginPath') {
      ctx.beginPath();
      continue;
    }

    if (type === 'closePath') {
      ctx.closePath();
      continue;
    }

    if (type === 'globalAlpha') {
      globalAlphaStack.push(ctx.globalAlpha);
      ctx.globalAlpha *= props.value;
      continue;
    }

    if (type === 'endGlobalAlpha') {
      ctx.globalAlpha = globalAlphaStack.pop();
      continue;
    }

    if (type === 'hitRect' && regions) {
      cache = [
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      ];

      regions.push({
        id: props.id,
        points: props.points,
        matrix: cache,
        //rectangle!
        polygon: false,
        hover: false,
        touched: false,
        clicked: false
      });
    }

    if (type === 'hitRegion' && regions) {
      cache = [
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      ];

      regions.push({
        id: props.id,
        points: props.points,
        matrix: cache,
        polygon: true,
        hover: false,
        touched: false,
        clicked: false
      });

      continue;
    }

    if (type === 'imageSmoothingEnabled') {
      imageSmoothingEnabledStack.push(ctx.imageSmoothingEnabled);
      ctx.imageSmoothingEnabled = props.value;

      continue;
    }

    if (type === 'endImageSmoothingEnabled') {
      ctx.imageSmoothingEnabled = imageSmoothingEnabledStack.pop();
      continue;
    }

    if (extensions && extensions[type]) {
      extensions[type](props, ctx);
      continue;
    }
  }
};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

let setTransform = __webpack_require__(10);

let resetTransform = (...children) => setTransform([1, 0, 0, 1, 0, 0], children);

module.exports = resetTransform;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('restore');

let rotate = (r, ...children) => [
  new Instruction('rotate', { cos: Math.cos(r), sin: Math.sin(r) }),
  children,
  end
];

module.exports = rotate;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('restore');

let scale = (x, y, ...children) => {
  if (typeof y !== 'number') {
    children = [y].concat(children);
    y = x;
  }

  return [
    new Instruction('scale', { x, y }),
    children,
    end
  ];
};

module.exports = scale;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

let concat = [].concat;
let Instruction = __webpack_require__(0);
let consts = __webpack_require__(1);

//property indexes
let lineCapProps = ['butt', 'round', 'square'];
let lineJoinProps = ['bevel', 'round', 'miter'];
let textBaselineProps = ["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"];
let textAlignProps = ["left", "right", "center", "start", "end"];
let directionProps = ["ltr", "rtl", "inherit"];
let globalCompositeOperationProps = [
  "source-over","source-in", "source-out",
  "source-atop", "destination-over", "destination-in",
  "destination-out", "destination-atop", "lighter",
  "copy", "xor", "multiply",
  "screen", "overlay", "darken",
  "lighten", "color-dodge", "color-burn",
  "hard-light", "soft-light", "difference",
  "exclusion", "hue", "saturation",
  "color", "luminosity"
];

let emptyInstructions = {
  'endLineStyle': true,
  'endTextStyle': true,
  'endStrokeStyle': true,
  'endFillStyle': true,
  'endShadowStyle': true,
  'restore': true,
  'endGlobalCompositeOperation': true,
  'fill': true,
  'stroke': true,
  'beginClip': true,
  'clip': true,
  'endClip': true,
  'beginPath': true,
  'closePath': true,
  'endGlobalAlpha': true,
  'endImageSmoothingEnabled': true
};

let arcs = {
  'fillArc': true,
  'strokeArc': true,
  'arc': true
};

let points = {
  'moveTo': true,
  'lineTo': true
};


let pushString = (data, value) => {
  for (let i = 0; i < value.length; i++) {
    data.push(
      value.charCodeAt(i)
    );
  }
};

let serialize = (...args) => {
  let custom = {};

  //flatten the tree
  for (let i = 0; i < args.length; i++) {
    while (args[i] && args[i].constructor === Array) {
      args = concat.apply([], args);
    }
  }

  //detect custom serializer
  if (args[args.length - 1].constructor !== Instruction) {
    custom = args[args.length - 1];
    args.splice(-1, 1);
  }

  let result = [];

  for (let i = 0; i < args.length; i++) {
    let { type, props } = args[i];

    if (type === 'transform') {
      result.push(consts.transform, props[0], props[1], props[2], props[3], props[4], props[5]);
      continue;
    }

    if (type === 'setTransform') {
      result.push(consts.setTransform, props[0], props[1], props[2], props[3], props[4], props[5]);
      continue;
    }

    if (type === 'scale') {
      result.push(consts.scale, props.x, props.y);
      continue;
    }

    if (type === 'translate') {
      result.push(consts.translate, props.x, props.y);
      continue;
    }

    if (type === 'rotate') {
      result.push(consts.rotate, props.cos, props.sin);
      continue;
    }

    if (type === 'skewX') {
      result.push(consts.skewX, props.x);
      continue;
    }

    if (type === 'skewY') {
      result.push(consts.skewY, props.y);
      continue;
    }

    if (type === 'fillRect' || type === 'strokeRect' || type === 'clearRect' || type === 'rect') {
      result.push(consts[type], props.x, props.y, props.width, props.height);
      continue;
    }

    if (type === 'fillStyle' || type === 'strokeStyle') {
      result.push(
        consts[type],
        props.value.length
      );

      pushString(result, props.value);
      continue;
    }


    if (type === 'lineStyle') {
      result.push(
        consts.lineStyle,
        props.lineWidth !== null ? props.lineWidth : NaN,
        props.lineCap ? lineCapProps.indexOf(props.lineCap) : NaN,
        props.lineJoin ? lineJoinProps.indexOf(props.lineJoin) : NaN,
        props.miterLimit !== null ? props.miterLimit : NaN,
        props.lineDashOffset !== null ? props.lineDashOffset : NaN,
        props.lineDash !== null ? props.lineDash.length : NaN
      );

      if (props.lineDash !== null) {
        for (let j = 0; j < props.lineDash.length; j++) {
          result.push(props.lineDash);
        }
      }
      continue;
    }

    if (type === 'textStyle') {
      result.push(
        consts.textStyle,
        props.textAlign ? textAlignProps.indexOf(props.textAlign) : NaN,
        props.textBaseline ? textBaselineProps.indexOf(props.textBaseline) : NaN,
        props.direction ? directionProps.indexOf(props.direction) : NaN,
        props.font ? props.font.length : NaN
      );

      if (props.font !== null) {
        pushString(result, props.font);
      }
      continue;
    }

    if (type === 'shadowStyle') {
      result.push(
        consts.shadowStyle,
        props.shadowBlur !== null ? props.shadowBlur : NaN,
        props.shadowOffsetX !== null ? props.shadowOffsetX : NaN,
        props.shadowOffsetY !== null ? props.shadowOffsetY : NaN,
        props.shadowColor !== null ? props.shadowColor.length : NaN
      );

      if (props.shadowColor !== null) {
        pushString(result, props.shadowColor);
      }
      continue;
    }

    if (type === 'fillText' || type === 'strokeText') {
      result.push(
        consts[type],
        props.x,
        props.y,
        props.maxWidth !== null ? props.maxWidth : NaN,
        props.text.length
      );

      pushString(result, props.text);
      continue;
    }

    if (type === 'arcTo') {
      result.push(
        consts.arcTo,
        props.x1,
        props.y1,
        props.x2,
        props.y2,
        props.r
      );
    }

    if (arcs[type]) {
      result.push(
        consts[type],
        props.x,
        props.y,
        props.r,
        props.startAngle,
        props.endAngle,
        props.counterclockwise ? 1 : 0
      );
      continue;
    }

    if (type === 'ellipse') {
      result.push(
        consts.ellipse,
        props.x,
        props.y,
        props.radiusX,
        props.radiusY,
        props.rotation,
        props.startAngle,
        props.endAngle,
        props.anticlockwise ? 1 : 0
      );
      continue;
    }

    if (type === 'globalCompositeOperation') {
      result.push(
        consts.globalCombpositeOperation,
        globalCompositeOperationProps.indexOf(props.value)
      );
      continue;
    }

    if (type === 'globalAlpha') {
      result.push(
        consts.globalAlpha,
        props.value
      );
      continue;
    }

    if (points[type]) {
      result.push(
        consts[type],
        props.x,
        props.y
      );
      continue;
    }

    if (type === 'hitRect') {
      result.push(
        consts.hitRect,
        //x
        props.points[0][0],
        //y
        props.points[0][1],
        //width
        props.points[1][0],
        //height
        props.points[1][1],
        props.id.length
      );
      pushString(result, props.id);

      continue;
    }

    if (type === 'hitRegion') {
      result.push(
        consts.hitRegion,
        props.points.length
      );
      for(let j = 0; j < props.points.length; j++) {
        result.push(props.points[j][0], props.points[j][1]);
      }
      result.push(props.id.length);
      pushString(result, props.id);

      continue;
    }

    if (type === 'bezierCurveTo') {
      result.push(
        consts.bezierCurveTo,
        props.cp1x,
        props.cp1y,
        props.cp2x,
        props.cp2y,
        props.x,
        props.y
      );

      continue;
    }

    if (type === 'quadraticCurveTo') {
      result.push(
        consts.quadraticCurveTo,
        props.cpx,
        props.cpy,
        props.x,
        props.y
      );

      continue;
    }

    if (type === 'imageSmoothingEnabled') {
      result.push(
        consts.imageSmoothingEnabled,
        props.value ? 1 : 0
      );
      continue;
    }

    if (emptyInstructions.hasOwnProperty(type)) {
      result.push(consts[type]);
      continue;
    }

    if (custom.hasOwnProperty(type)) {
      result.push(
        consts.custom,
        type.length
      );
      pushString(result, type);

      let data = custom[type](props);

      result.push(data.length);
      for(let j = 0; j < data.length; j++) {
        result.push(data[j]);
      }
      continue;
    }
  }

  return new Float64Array(result);
};

module.exports = serialize;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('endShadowStyle');

let shadowStyle = (value, ...children) => {
  value = value || {};
  var result = {
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
    new Instruction('shadowStyle', value),
    children,
    end
  ];
};

module.exports = shadowStyle;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('restore');

let skewX = (x, ...children) => [
  new Instruction('skewX', { x: Math.tan(x) }),
  children,
  end
];

module.exports = skewX;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('restore');

let skewY = (x, ...children) => [
  new Instruction('skewY', { y: Math.tan(y) }),
  children,
  end
];

module.exports = skewY;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let cache = new Instruction('stroke');

let stroke = () => cache;
module.exports = stroke;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0),
    pi2 = Math.PI * 2;

let strokeArc = (...args) => {
  let [x, y, r, startAngle, endAngle, counterclockwise] = args;
  let props = { x: 0, y: 0, r: x, startAngle: 0, endAngle: pi2, counterclockwise: false };


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

module.exports = strokeArc;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let strokeRect = (...args) => new Instruction('strokeRect',
  args.length > 2 ?
    { x: args[0], y: args[1], width: args[2], height: args[3] } :
    { x: 0, y: 0, width: args[0], height: args[1] }
);

module.exports = strokeRect;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('endStrokeStyle');

let strokeStyle = (value, ...children) => [
  new Instruction('strokeStyle', { value }),
  children,
  end
];

module.exports = strokeStyle;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);

let strokeText = (...args) => {
  let [text, x, y, maxWidth] = args;

  if (args.length < 4) {
    maxWidth = null;
  }
  if (args.length < 3) {
    x = 0;
    y = 0;
  }
  return new Instruction('strokeText', {
    text,
    x,
    y,
    maxWidth
  });
};

module.exports = strokeText;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('endTextStyle');

let textStyle = (value, ...children) => {
  value = value || {};
  var result = {
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
    end
  ];
};

module.exports = textStyle;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('restore');

let transform = (values, ...children) => {
  return [
    new Instruction('transform',[
      values[0],
      values[1],
      values[2],
      values[3],
      values[4],
      values[5]
    ]),
    children,
    end
  ];
};


module.exports = transform;


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

let Instruction = __webpack_require__(0);
let end = new Instruction('restore');

let translate = (x, y, ...children) => [
  new Instruction('translate', { x: x, y: y }),
  children,
  end
];

module.exports = translate;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var src = __webpack_require__(12),
  path = __webpack_require__(11);

module.exports = src.keys().reduce(function(index, key) {
  index[path.basename(key, path.extname(key))] = src(key);
  return index;
}, {});


/***/ }
/******/ ]);
});