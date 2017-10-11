'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (global, factory) {
  (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.e2d = factory();
})(undefined, function () {
  'use strict';

  var transformPoints = function transformPoints(points, matrix) {
    var result = [];
    var x = void 0,
        y = void 0;

    for (var i = 0; i < points.length; i++) {
      var _points$i = _slicedToArray(points[i], 2);

      x = _points$i[0];
      y = _points$i[1];

      result.push([matrix[0] * x + matrix[2] * y + matrix[4], matrix[1] * x + matrix[3] * y + matrix[5]]);
    }
    return result;
  };

  var det = 0;
  var invertMatrix = function invertMatrix(_ref) {
    var _ref2 = _slicedToArray(_ref, 6),
        a = _ref2[0],
        b = _ref2[1],
        c = _ref2[2],
        d = _ref2[3],
        e = _ref2[4],
        f = _ref2[5];

    return det = 1 / (a * d - c * b), [d * det, -c * det, -b * det, a * det, (b * f - e * d) * det, (e * b - a * f) * det];
  };

  var pointInRect = function pointInRect(_ref3, _ref4) {
    var _ref6 = _slicedToArray(_ref3, 2),
        px = _ref6[0],
        py = _ref6[1];

    var _ref5 = _slicedToArray(_ref4, 2),
        _ref5$ = _slicedToArray(_ref5[0], 2),
        x = _ref5$[0],
        y = _ref5$[1],
        _ref5$2 = _slicedToArray(_ref5[1], 2),
        width = _ref5$2[0],
        height = _ref5$2[1];

    return px > x && py > y && px < width && py < height;
  };

  var pointInCircle = function pointInCircle(_ref7, _ref8) {
    var _ref10 = _slicedToArray(_ref7, 2),
        x = _ref10[0],
        y = _ref10[1];

    var _ref9 = _slicedToArray(_ref8, 3),
        cx = _ref9[0],
        cy = _ref9[1],
        cr = _ref9[2];

    return Math.pow(cx - x, 2) + Math.pow(cy - y, 2) < Math.pow(cr, 2);
  };

  var pointInPolygon = function pointInPolygon(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0],
        y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
          yi = vs[i][1];
      var xj = vs[j][0],
          yj = vs[j][1];

      var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };

  var alwaysFalse = function alwaysFalse() {
    return false;
  };

  var activeRegions = function activeRegions(ctx) {
    var regions = ctx.canvas[Symbol.for("regions")],
        mousePoints = ctx.canvas[Symbol.for("mousePoints")],
        mouseData = ctx.canvas[Symbol.for("mouseData")],
        results = {};

    //The mouse might have held still, add the current mouse position to make the data consistent
    if (mousePoints.length === 0) {
      mousePoints.push([mouseData.x, mouseData.y, mouseData.state]);
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = regions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var region = _step.value;


        //Invert the region matrix and transform the mouse points
        var transformedMousePoints = transformPoints(mousePoints, invertMatrix(region.matrix));

        //The mouse points are now relative to the mouse region, use the appropriate test
        var test = region.type === "hitRect" ? pointInRect : region.type === "hitRegion" ? pointInPolygon : region.type === "hitCircle" ? pointInCircle : alwaysFalse;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = transformedMousePoints[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var mousePoint = _step2.value;

            if (test(mousePoint, region.points)) {
              region.hover = true;
              region.clicked = !!mouseData.clicked;
              results[region.id] = region;
              break;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return results;
  };

  var Instruction = function Instruction(type, props) {
    _classCallCheck(this, Instruction);

    this.type = type;
    this.props = props;
    return Object.seal(this);
  };

  Object.seal(Instruction);
  Object.seal(Instruction.prototype);

  var pi2$1 = Math.PI * 2;

  var arc = function arc() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length > 3) {
      return new Instruction("call", { name: "arc", args: args, count: 6 });
    }
    if (args.length > 1) {
      return new Instruction("call", {
        name: "arc",
        args: [args[0], args[1], args[2], 0, pi2$1, false], count: 6 });
    }

    return new Instruction("call", {
      name: "arc",
      args: [0, 0, args[0], 0, pi2$1, false], count: 6
    });
  };

  var arcTo = function arcTo(x1, y1, x2, y2, r) {
    return new Instruction("call", {
      name: "arcTo", args: [x1, y1, x2, y2, r], count: 5
    });
  };

  var emptyCall = function emptyCall(name) {
    return function () {
      return new Instruction("call", { name: name, args: [], count: 0 });
    };
  };

  var beginPath = emptyCall("beginPath");

  var bezierCurveTo = function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    return new Instruction("call", {
      name: "bezierCurveTo",
      args: [cp1x, cp1y, cp2x, cp2y, x, y],
      count: 5
    });
  };

  var rectInstruction = function rectInstruction(name) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return new Instruction("call", {
        name: name,
        args: args.length > 2 ? args : [0, 0, args[0], args[1]],
        count: 4
      });
    };
  };

  var clearRect = rectInstruction("clearRect");

  var begin = [emptyCall("save"), emptyCall("beginPath")];
  var performClip = emptyCall("clip");
  var end = emptyCall("restore");

  var clip = function clip(path) {
    for (var _len3 = arguments.length, children = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      children[_key3 - 1] = arguments[_key3];
    }

    return [begin, path, performClip, children, end];
  };

  var clipPath = function clipPath() {
    return new Instruction("call", { name: "clip", args: [], count: 0 });
  };

  var closePath = emptyCall("closePath");

  var PI2 = Math.PI * 2;
  var createRegularPolygon = function createRegularPolygon() {
    var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
    var sides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

    var polygon = [];
    var factor = PI2 / sides;
    for (var i = 0; i < sides; i++) {
      polygon.push([position[0] + radius * Math.cos(factor * i), position[1] + radius * Math.sin(factor * i)]);
    }
    return polygon;
  };

  var stackable = function stackable(stack) {
    var end = new Instruction("pop", { stack: stack });
    var stackableFunc = function stackableFunc(value) {
      for (var _len4 = arguments.length, children = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        children[_key4 - 1] = arguments[_key4];
      }

      return [new Instruction("push", { stack: stack, value: value })].concat(children, [end]);
    };

    return stackableFunc;
  };

  var directionCall = stackable("direction");

  var drawImage = function drawImage() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    if (args.length >= 9) {
      return new Instruction("call", {
        name: "drawImage",
        args: args,
        count: 9
      });
    }

    var img = args[0],
        sx = args[1],
        sy = args[2],
        sWidth = args[3],
        sHeight = args[4],
        dx = args[5],
        dy = args[6],
        dWidth = args[7],
        dHeight = args[8];


    if (args.length >= 5) {
      return new Instruction("call", {
        name: "drawImage",
        args: [img, sx, sy, sWidth, sHeight],
        count: 5
      });
    }

    return new Instruction("call", {
      name: "drawImage",
      args: args.length >= 3 ? [img, sx, sy] : [img, 0, 0],
      count: 3
    });
  };

  var Pi2 = Math.PI * 2;

  var ellipse = function ellipse() {
    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    var x = args[0],
        y = args[1],
        radiusX = args[2],
        radiusY = args[3],
        rotation = args[4],
        startAngle = args[5],
        endAngle = args[6],
        anticlockwise = args[7];


    return new Instruction("call", {
      name: "ellipse",
      args: args.length > 5 ? args : args.length > 4 ? [x, y, radiusX, radiusY, rotation, startAngle, false] : args.length > 2 ? [x, y, radiusX, radiusY, 0, pi2, false] : [0, 0, x, y, 0, Pi2, false],
      count: 7
    });
  };

  var endClip = emptyCall("restore");

  var extend = function extend(ctx) {
    for (var _len7 = arguments.length, methods = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      methods[_key7 - 1] = arguments[_key7];
    }

    var extensions = ctx[Symbol.for("extensions")] || (ctx[Symbol.for("extensions")] = {});
    Object.assign.apply(Object, [extensions].concat(methods));
  };

  var fill = emptyCall("fill");

  var fillArc = function fillArc() {
    var props = [0, 0, arguments.length <= 0 ? undefined : arguments[0], 0, Pi2, false];

    if (arguments.length > 3) {
      props[3] = arguments.length <= 3 ? undefined : arguments[3];
      props[4] = arguments.length <= 4 ? undefined : arguments[4];
      props[5] = !!(arguments.length <= 5 ? undefined : arguments[5]);
    }

    if (arguments.length >= 2) {
      props[0] = arguments.length <= 0 ? undefined : arguments[0];
      props[1] = arguments.length <= 1 ? undefined : arguments[1];
      props[2] = arguments.length <= 2 ? undefined : arguments[2];
    }

    return new Instruction("fillArc", props);
  };

  var fillRect = rectInstruction("fillRect");

  var fillStyle = stackable("fillStyle");

  var textInstruction = function textInstruction(name) {
    return function () {
      for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      return new Instruction("call", {
        name: name,
        args: args.length >= 3 ? args : [args[0], 0, 0],
        count: args.length >= 4 ? 4 : 3
      });
    };
  };

  var fillText = textInstruction("fillText");

  var fontCall = stackable("font");

  var globalAlpha = stackable("globalAlpha");

  var globalCompositeOperation = stackable("globalCompositeOperation");

  var hitCircle = function hitCircle(id) {
    return new Instruction("hitCircle", {
      id: id,
      points: (arguments.length <= 1 ? 0 : arguments.length - 1) === 1 ? [0, 0, arguments.length <= 1 ? undefined : arguments[1]] : [arguments.length <= 1 ? undefined : arguments[1], arguments.length <= 2 ? undefined : arguments[2], arguments.length <= 3 ? undefined : arguments[3]]
    });
  };

  var hitRect = function hitRect(id) {
    for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
      args[_key9 - 1] = arguments[_key9];
    }

    var x = args[0],
        y = args[1],
        width = args[2],
        height = args[3];

    if (args.length <= 3) {
      width = x;
      height = y;
      x = 0;
      y = 0;
    }
    return new Instruction("hitRect", {
      id: id,
      points: [[x, y], [x + width, y + height]]
    });
  };

  var hitRegion = function hitRegion(id, points) {
    return new Instruction("hitRegion", { id: id, points: points });
  };

  var imageSmoothingEnabled = stackable("imageSmoothingEnabled");

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

    exports = module.exports = function (searchInput) {
      // Keyboard Events
      if (searchInput && 'object' === (typeof searchInput === 'undefined' ? 'undefined' : _typeof(searchInput))) {
        var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
        if (hasKeyCode) searchInput = hasKeyCode;
      }

      // Numbers
      if ('number' === typeof searchInput) return names[searchInput];

      // Everything else (cast to string)
      var search = String(searchInput);

      // check codes
      var foundNamedKey = codes[search.toLowerCase()];
      if (foundNamedKey) return foundNamedKey;

      // check aliases
      var foundNamedKey = aliases[search.toLowerCase()];
      if (foundNamedKey) return foundNamedKey;

      // weird character?
      if (search.length === 1) return search.charCodeAt(0);

      return undefined;
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
    for (i = 97; i < 123; i++) {
      codes[String.fromCharCode(i)] = i - 32;
    } // numbers
    for (var i = 48; i < 58; i++) {
      codes[i - 48] = i;
    } // function keys
    for (i = 1; i < 13; i++) {
      codes['f' + i] = i + 111;
    } // numpad keys
    for (i = 0; i < 10; i++) {
      codes['numpad ' + i] = i + 96;
    } /**
       * Get by code
       *
       *   exports.name[13] // => 'Enter'
       */

    var names = exports.names = exports.title = {}; // title for backward compat

    // Create reverse mapping
    for (i in codes) {
      names[codes[i]] = i;
    } // Add aliases
    for (var alias in aliases) {
      codes[alias] = aliases[alias];
    }
  });

  var initialize = function initialize(ctx) {
    var canvas = ctx.canvas;

    //MouseData

    canvas[Symbol.for("mouseData")] = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      previousX: 0,
      previousY: 0,
      state: false,
      clicked: 0
    };

    var keys = canvas[Symbol.for("keyData")] = {};

    for (var name in keycode.code) {
      if (keycode.code.hasOwnProperty(name)) {
        keys[name] = false;
      }
    }

    //Mouse regions
    canvas[Symbol.for("regions")] = [];
    canvas[Symbol.for("mousePoints")] = [];

    //Make the canvas receive touch and mouse events
    canvas.tabIndex = 1;

    var mouseMove = function mouseMove(evt) {
      var clientX = evt.clientX,
          clientY = evt.clientY;

      //Get left and top coordinates

      var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
          left = _canvas$getBoundingCl.left,
          top = _canvas$getBoundingCl.top;

      var mouseData = canvas[Symbol.for("mouseData")];

      var point = [clientX - left, clientY - top, mouseData.state];

      mouseData.x = point[0];
      mouseData.y = point[1];

      var points = canvas[Symbol.for("mousePoints")];

      points.push(point);

      //Store the last 100 stored positions for hover detection
      if (points.length > 100) {
        points.splice(0, points.length - 100);
      }

      evt.preventDefault();
      return false;
    };

    //Up target needs to detect mouse up and keyup events if the mouse leaves the canvas
    var upTarget = typeof window !== "undefined" ? window : canvas;

    canvas.addEventListener("mousemove", mouseMove);
    canvas.addEventListener("mousedown", function (evt) {
      var target = evt.target;

      if (target === canvas) {
        var _mouseData = canvas[Symbol.for("mouseData")];

        if (!_mouseData.state) {
          _mouseData.clicked += 1;
        }

        _mouseData.state = true;
        return mouseMove(evt);
      }
    });

    canvas.addEventListener("keydown", function (evt) {
      canvas[Symbol.for("keyData")][keycode(evt.keyCode)] = true;
      evt.preventDefault();
      return false;
    });

    upTarget.addEventListener("mouseup", function (evt) {
      var mouseData = canvas[Symbol.for("mouseData")];
      mouseData.state = false;
      mouseMove(evt);
    });

    upTarget.addEventListener("keyup", function (evt) {
      canvas[Symbol.for("keyData")][keycode(evt.keyCode)] = false;
      evt.preventDefault();
    });
  };

  var keyData = function keyData(ctx) {
    return ctx.canvas[Symbol.for("keyData")];
  };

  var lineCapCall = stackable("lineCap");

  var lineDashCall = stackable("lineDash");

  var lineDashOffsetCall = stackable("lineDashOffset");

  var lineJoinCall = stackable("lineJoin");

  var lineWidthCall = stackable("lineWidth");

  var miterLimitCall = stackable("miterLimit");

  var lineStyle = function lineStyle(_ref11) {
    for (var _len10 = arguments.length, children = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
      children[_key10 - 1] = arguments[_key10];
    }

    var lineCap = _ref11.lineCap,
        lineDash = _ref11.lineDash,
        lineDashOffset = _ref11.lineDashOffset,
        lineJoin = _ref11.lineJoin,
        lineWidth = _ref11.lineWidth,
        miterLimit = _ref11.miterLimit;

    children = lineCap ? lineCapCall(children) : children;
    children = lineDash ? lineDashCall(children) : children;
    children = lineDashOffset == null ? children : lineDashOffsetCall(children);
    children = lineJoin ? lineJoinCall(children) : children;
    children = lineWidth == null ? children : lineWidthCall(children);
    return miterLimit == null ? children : miterLimitCall(children);
  };

  var pointInstruction = function pointInstruction(name) {
    return function (x, y) {
      return new Instruction("call", {
        name: name,
        args: [x, y],
        count: 2
      });
    };
  };

  var lineTo = pointInstruction("lineTo");

  var mouseData = function mouseData(ctx) {
    return ctx.canvas[Symbol.for("mouseData")];
  };

  var moveTo = pointInstruction("moveTo");

  var moveToLineTo = function moveToLineTo(point, index) {
    return index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);
  };

  var path = function path() {
    for (var _len11 = arguments.length, children = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      children[_key11] = arguments[_key11];
    }

    return [beginPath(), children, closePath()];
  };

  var quadraticCurveTo = function quadraticCurveTo(cpx, cpy, x, y) {
    return new Instruction("call", {
      name: "quadraticCurveTo",
      args: [cpx, cpy, x, y],
      count: 4
    });
  };

  var raf = function raf(func) {
    var funcCaller = function funcCaller() {
      requestAnimationFrame(funcCaller);
      return func();
    };

    requestAnimationFrame(funcCaller);
  };

  var rect = rectInstruction("rect");

  var cycleMouseData = function cycleMouseData(ctx) {
    var mouseData = ctx.canvas[Symbol.for("mouseData")];
    if (mouseData) {
      mouseData.dx = mouseData.x - mouseData.previousX;
      mouseData.dy = mouseData.y - mouseData.previousY;

      mouseData.previousX = mouseData.x;
      mouseData.previousY = mouseData.y;

      mouseData.clicked = 0;
    }
  };

  //Initialize all the properties
  var identity = [1, 0, 0, 1, 0, 0];
  var concat = [].concat;

  //Transform points function
  var relativeTransforms = {
    transform: true,
    scale: true,
    rotate: true,
    translate: true,
    skewX: true,
    skewY: true
  };

  var upTransforms = {
    transform: true,
    scale: true,
    rotate: true,
    translate: true,
    skewX: true,
    skewY: true,
    setTransform: true
  };

  var render = function render() {
    for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
    }

    var children = args.slice(0, -1),
        isTransformDirty = true,
        transformStackIndex = 6,
        transformStack = new Float64Array(501 * 6),
        cache = void 0;

    transformStack.set(identity);

    var ctx = args[args.length - 1];

    cycleMouseData(ctx);

    var matrix = new Float64Array(identity),
        regions = ctx.canvas[Symbol.for("regions")] = [],
        mousePoints = ctx.canvas[Symbol.for("mousePoints")] = [],
        extensions = ctx.canvas[Symbol.for("extensions")];

    var stack = {
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
      globalAlpha: []
    };

    transformStack[0] = identity[0];
    transformStack[1] = identity[1];
    transformStack[2] = identity[2];
    transformStack[3] = identity[3];
    transformStack[4] = identity[4];
    transformStack[5] = identity[5];

    var increaseTransformStackSize = function increaseTransformStackSize() {
      cache = transformStack;
      transformStack = new Float64Array(transformStack.length + 600); //Add 100 more
      transformStack.set(cache);
    };

    var len = children.length;

    //Flatten children during the loop process to save cpu
    for (var i = 0; i < len; i++) {
      var child = children[i];

      //Flatten as you go algorithm
      if (child && child.constructor === Array) {
        children = concat.apply([], children);
        child = children[i];

        //Repeat as necessary
        while (child && child.constructor === Array) {
          children = concat.apply([], children);
          child = children[i];
        }

        len = children.length;
      }

      //Child must be truthy
      if (!child) {
        continue;
      }

      var _child = child,
          props = _child.props,
          type = _child.type;


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
        if (transformStackIndex >= transformStack.length) {
          increaseTransformStackSize();
        }
      }

      switch (type) {
        case "transform":
          transformStack[transformStackIndex - 6] = //A
          matrix[0] * props[0] + matrix[2] * props[1];
          transformStack[transformStackIndex - 5] = //B
          matrix[1] * props[0] + matrix[3] * props[1];
          transformStack[transformStackIndex - 4] = //C
          matrix[0] * props[2] + matrix[2] * props[3];
          transformStack[transformStackIndex - 3] = //D
          matrix[1] * props[2] + matrix[3] * props[3];
          transformStack[transformStackIndex - 2] = //E
          matrix[0] * props[4] + matrix[2] * props[5] + matrix[4];
          transformStack[transformStackIndex - 1] = //F
          matrix[1] * props[4] + matrix[3] * props[5] + matrix[5];

          isTransformDirty = true;
          continue;

        case "setTransform":
          transformStack[transformStackIndex - 6] = props[0]; //A
          transformStack[transformStackIndex - 5] = props[1]; //B
          transformStack[transformStackIndex - 4] = props[2]; //C
          transformStack[transformStackIndex - 3] = props[3]; //D
          transformStack[transformStackIndex - 2] = props[4]; //E
          transformStack[transformStackIndex - 1] = props[5]; //F

          isTransformDirty = true;
          continue;

        case "scale":
          transformStack[transformStackIndex - 6] = matrix[0] * props.x; //A
          transformStack[transformStackIndex - 5] = matrix[1] * props.x; //B
          transformStack[transformStackIndex - 4] = matrix[2] * props.y; //C
          transformStack[transformStackIndex - 3] = matrix[3] * props.y; //D
          transformStack[transformStackIndex - 2] = matrix[4]; //E
          transformStack[transformStackIndex - 1] = matrix[5]; //F

          isTransformDirty = true;
          continue;

        case "translate":
          transformStack[transformStackIndex - 6] = matrix[0]; //A
          transformStack[transformStackIndex - 5] = matrix[1]; //B
          transformStack[transformStackIndex - 4] = matrix[2]; //C
          transformStack[transformStackIndex - 3] = matrix[3]; //D
          transformStack[transformStackIndex - 2] = matrix[4] + matrix[0] * props.x + matrix[2] * props.y; //E
          transformStack[transformStackIndex - 1] = matrix[5] + matrix[1] * props.x + matrix[3] * props.y; //F

          isTransformDirty = true;
          continue;

        case "rotate":
          transformStack[transformStackIndex - 6] = matrix[0] * props.cos + matrix[2] * props.sin; //A
          transformStack[transformStackIndex - 5] = matrix[1] * props.cos + matrix[3] * props.sin; //B
          transformStack[transformStackIndex - 4] = matrix[0] * -props.sin + matrix[2] * props.cos; //C
          transformStack[transformStackIndex - 3] = matrix[1] * -props.sin + matrix[3] * props.cos; //D
          transformStack[transformStackIndex - 2] = matrix[4]; //E
          transformStack[transformStackIndex - 1] = matrix[5]; //F

          isTransformDirty = true;
          continue;

        case "skewX":
          transformStack[transformStackIndex - 6] = matrix[0]; //A
          transformStack[transformStackIndex - 5] = matrix[1]; //B
          transformStack[transformStackIndex - 4] = //C
          matrix[0] * props.x + matrix[2];
          transformStack[transformStackIndex - 3] = //D
          matrix[1] * props.x + matrix[3];
          transformStack[transformStackIndex - 2] = matrix[4]; //E
          transformStack[transformStackIndex - 1] = matrix[5]; //F

          isTransformDirty = true;
          continue;

        case "skewY":
          transformStack[transformStackIndex - 6] = matrix[0] * 1 + matrix[2] * props.y; //A
          transformStack[transformStackIndex - 5] = matrix[1] * 1 + matrix[3] * props.y; //B
          transformStack[transformStackIndex - 4] = matrix[2]; //C
          transformStack[transformStackIndex - 3] = matrix[3]; //D
          transformStack[transformStackIndex - 2] = matrix[4]; //E
          transformStack[transformStackIndex - 1] = matrix[5]; //F

          isTransformDirty = true;
          continue;

        case "restore":
          transformStackIndex -= 6;
          isTransformDirty = true;
          continue;
      }

      if (isTransformDirty) {
        isTransformDirty = false;
        ctx.setTransform(transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]);
      }

      switch (type) {
        case "push":
          stack[props.stack].push(props.stack === "lineDash" ? ctx.getLineDash() : ctx[props.stack]);

          if (props.stack === "globalAlpha") {
            ctx[props.stack] *= props.value;
          } else if (props.stack === "lineDash") {
            ctx.setLineDash(props.value);
          } else {
            ctx[props.stack] = props.value;
          }
          continue;

        case "pop":
          if (props.stack === "lineDash") {
            ctx.setLineDash(stack.lineDash.pop());
            continue;
          }

          ctx[props.stack] = stack[props.stack].pop();
          continue;

        case "call":
          var name = props.name,
              _args = props.args,
              count = props.count;

          switch (count) {
            case 0:
              ctx[name]();
              continue;
            case 1:
              ctx[name](_args[0]);
              continue;
            case 2:
              ctx[name](_args[0], _args[1]);
              continue;
            case 3:
              ctx[name](_args[0], _args[1], _args[2]);
              continue;
            case 4:
              ctx[name](_args[0], _args[1], _args[2], _args[3]);
              continue;
            case 5:
              ctx[name](_args[0], _args[1], _args[2], _args[3], _args[4]);
              continue;
            case 6:
              ctx[name](_args[0], _args[1], _args[2], _args[3], _args[4], _args[5]);
              continue;
            case 7:
              ctx[name](_args[0], _args[1], _args[2], _args[3], _args[4], _args[5], _args[6]);
              continue;
            case 8:
              ctx[name](_args[0], _args[1], _args[2], _args[3], _args[4], _args[5], _args[6], _args[7]);
              continue;
            case 9:
              ctx[name](_args[0], _args[1], _args[2], _args[3], _args[4], _args[5], _args[6], _args[7], _args[8]);
              continue;
          }

        case "strokeArc":
          ctx.beginPath();
          ctx.arc(props[0], props[1], props[2], props[3], props[4], props[5]);
          ctx.closePath();
          ctx.stroke();
          continue;

        case "fillArc":
          ctx.beginPath();
          ctx.arc(props[0], props[1], props[2], props[3], props[4], props[5]);
          ctx.closePath();
          ctx.fill();
          continue;

        case "globalAlpha":
          globalAlphaStack.push(ctx.globalAlpha);
          ctx.globalAlpha *= props.value;
          continue;

        case "endGlobalAlpha":
          ctx.globalAlpha = globalAlphaStack.pop();
          continue;

        case "hitRect":
        case "hitRegion":
        case "hitCircle":
          if (regions) {
            regions.push({
              id: props.id,
              points: props.points,
              matrix: [transformStack[transformStackIndex - 6], transformStack[transformStackIndex - 5], transformStack[transformStackIndex - 4], transformStack[transformStackIndex - 3], transformStack[transformStackIndex - 2], transformStack[transformStackIndex - 1]],
              type: type, //Hit type goes here
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

  var end$1 = new Instruction("restore");

  var setTransform = function setTransform(matrix) {
    for (var _len13 = arguments.length, children = Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
      children[_key13 - 1] = arguments[_key13];
    }

    return [new Instruction("setTransform", [matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]]), children, end$1];
  };

  var resetTransform = function resetTransform() {
    for (var _len14 = arguments.length, children = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
      children[_key14] = arguments[_key14];
    }

    return setTransform([1, 0, 0, 1, 0, 0], children);
  };

  var end$2 = new Instruction("restore");

  var rotate = function rotate(r) {
    for (var _len15 = arguments.length, children = Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
      children[_key15 - 1] = arguments[_key15];
    }

    return [new Instruction("rotate", { cos: Math.cos(r), sin: Math.sin(r) }), children, end$2];
  };

  var end$3 = new Instruction("restore");

  var scale = function scale(x, y) {
    for (var _len16 = arguments.length, children = Array(_len16 > 2 ? _len16 - 2 : 0), _key16 = 2; _key16 < _len16; _key16++) {
      children[_key16 - 2] = arguments[_key16];
    }

    if (typeof y !== "number") {
      children = [y].concat(children);
      y = x;
    }

    return [new Instruction("scale", { x: x, y: y }), children, end$3];
  };

  var shadowBlurCall = stackable("shadowBlur");

  var shadowColorCall = stackable("shadowColor");

  var shadowOffsetXCall = stackable("shadowOffsetX");

  var shadowOffsetYCall = stackable("shadowOffsetY");

  var shadowStyle = function shadowStyle(_ref12) {
    for (var _len17 = arguments.length, children = Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
      children[_key17 - 1] = arguments[_key17];
    }

    var shadowBlur = _ref12.shadowBlur,
        shadowColor = _ref12.shadowColor,
        shadowOffsetX = _ref12.shadowOffsetX,
        shadowOffsetY = _ref12.shadowOffsetY;

    children = shadowBlur ? shadowBlurCall(children) : children;
    children = shadowColor ? shadowColorCall(children) : children;
    children = shadowOffsetX ? shadowOffsetXCall(children) : children;
    return shadowOffsetY ? shadowOffsetYCall(children) : children;
  };

  var end$4 = new Instruction("restore");

  var skewX = function skewX(x) {
    for (var _len18 = arguments.length, children = Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
      children[_key18 - 1] = arguments[_key18];
    }

    return [new Instruction("skewX", { x: Math.tan(x) }), children, end$4];
  };

  var end$5 = new Instruction("restore");

  var skewY = function skewY(y) {
    for (var _len19 = arguments.length, children = Array(_len19 > 1 ? _len19 - 1 : 0), _key19 = 1; _key19 < _len19; _key19++) {
      children[_key19 - 1] = arguments[_key19];
    }

    return [new Instruction("skewY", { y: Math.tan(y) }), children, end$5];
  };

  var stroke = emptyCall("stroke");

  var pi2$2 = Math.PI * 2;

  var fillArc$2 = function fillArc$2() {
    var props = [0, 0, arguments.length <= 0 ? undefined : arguments[0], 0, pi2$2, false];

    if (arguments.length > 3) {
      props[3] = arguments.length <= 3 ? undefined : arguments[3];
      props[4] = arguments.length <= 4 ? undefined : arguments[4];
      props[5] = !!(arguments.length <= 5 ? undefined : arguments[5]);
    }

    if (arguments.length >= 2) {
      props[0] = arguments.length <= 0 ? undefined : arguments[0];
      props[1] = arguments.length <= 1 ? undefined : arguments[1];
      props[2] = arguments.length <= 2 ? undefined : arguments[2];
    }

    return new Instruction("strokeArc", props);
  };

  var strokeRect = rectInstruction("strokeRect");

  var strokeStyle = stackable("strokeStyle");

  var strokeText = textInstruction("strokeText");

  var textAlignCall = stackable("textAlign");

  var textBaselineCall = stackable("textBaseline");

  var textStyle = function textStyle(_ref13) {
    for (var _len20 = arguments.length, children = Array(_len20 > 1 ? _len20 - 1 : 0), _key20 = 1; _key20 < _len20; _key20++) {
      children[_key20 - 1] = arguments[_key20];
    }

    var font = _ref13.font,
        textAlign = _ref13.textAlign,
        textBaseline = _ref13.textBaseline,
        direction = _ref13.direction;

    children = font ? fontCall(children) : children;
    children = textAlign ? textAlignCall(children) : children;
    children = textBaseline ? textBaselineCall(children) : children;
    return direction ? directionCall(children) : children;
  };

  var end$6 = new Instruction("restore");

  var transform = function transform(values) {
    for (var _len21 = arguments.length, children = Array(_len21 > 1 ? _len21 - 1 : 0), _key21 = 1; _key21 < _len21; _key21++) {
      children[_key21 - 1] = arguments[_key21];
    }

    return [new Instruction("transform", [values[0], values[1], values[2], values[3], values[4], values[5]]), children, end$6];
  };

  var end$7 = new Instruction("restore");

  var translate = function translate(x, y) {
    for (var _len22 = arguments.length, children = Array(_len22 > 2 ? _len22 - 2 : 0), _key22 = 2; _key22 < _len22; _key22++) {
      children[_key22 - 2] = arguments[_key22];
    }

    return [new Instruction("translate", { x: x, y: y }), children, end$7];
  };

  var index = {
    activeRegions: activeRegions,
    arc: arc,
    arcTo: arcTo,
    beginPath: beginPath,
    bezierCurveTo: bezierCurveTo,
    clearRect: clearRect,
    clip: clip,
    clipPath: clipPath,
    closePath: closePath,
    createRegularPolygon: createRegularPolygon,
    direction: directionCall,
    drawImage: drawImage,
    ellipse: ellipse,
    endClip: endClip,
    extend: extend,
    fill: fill,
    fillArc: fillArc,
    fillRect: fillRect,
    fillStyle: fillStyle,
    fillText: fillText,
    font: fontCall,
    globalAlpha: globalAlpha,
    globalCompositeOperation: globalCompositeOperation,
    hitCircle: hitCircle,
    hitRect: hitRect,
    hitRegion: hitRegion,
    imageSmoothingEnabled: imageSmoothingEnabled,
    initialize: initialize,
    Instruction: Instruction,
    invertMatrix: invertMatrix,
    keyData: keyData,
    lineStyle: lineStyle,
    lineTo: lineTo,
    mouseData: mouseData,
    moveTo: moveTo,
    moveToLineTo: moveToLineTo,
    path: path,
    pointInRect: pointInRect,
    quadraticCurveTo: quadraticCurveTo,
    raf: raf,
    rect: rect,
    render: render,
    resetTransform: resetTransform,
    rotate: rotate,
    scale: scale,
    setTransform: setTransform,
    shadowBlur: shadowBlurCall,
    shadowColor: shadowColorCall,
    shadowOffsetX: shadowOffsetXCall,
    shadowOffsetY: shadowOffsetYCall,
    shadowStyle: shadowStyle,
    skewX: skewX,
    skewY: skewY,
    stroke: stroke,
    strokeArc: fillArc$2,
    strokeRect: strokeRect,
    strokeStyle: strokeStyle,
    strokeText: strokeText,
    textAlign: textAlignCall,
    textBaseline: textBaselineCall,
    textStyle: textStyle,
    transform: transform,
    transformPoints: transformPoints,
    translate: translate
  };

  return index;
});

