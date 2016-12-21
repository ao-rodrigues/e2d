let concat = [].concat;
let Instruction = require('./Instruction');
let consts = require('./consts');

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