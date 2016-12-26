
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
const transformPoints = require('./transformPoints');
const cycleMouseData = require('./cycleMouseData');

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

    switch(type) {
      case 'transform':
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

        isTransformDirty = true;
        continue;

      case "setTransform":
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

        isTransformDirty = true;
        continue;

      case "scale":
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

        isTransformDirty = true;
        continue;

      case "translate":
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

        isTransformDirty = true;
        continue;

      case "rotate":
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

        isTransformDirty = true;
        continue;

      case "skewX":
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

        isTransformDirty = true;
        continue;

      case "skewY":
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

        isTransformDirty = true;
        continue;

      case "restore":
        transformStackIndex -= 6;

        isTransformDirty = true;
        continue;
    }

    if (isTransformDirty) {
      ctx.setTransform(
        transformStack[transformStackIndex - 6],
        transformStack[transformStackIndex - 5],
        transformStack[transformStackIndex - 4],
        transformStack[transformStackIndex - 3],
        transformStack[transformStackIndex - 2],
        transformStack[transformStackIndex - 1]
      );
    }


    switch(type) {
      case 'fillRect':
        ctx.fillRect(props.x, props.y, props.width, props.height);
        continue;

      case 'strokeRect':
        ctx.strokeRect(props.x, props.y, props.width, props.height);
        continue;

      case 'clearRect':
        ctx.clearRect(props.x, props.y, props.width, props.height);
        continue;

      case 'rect':
        ctx.rect(props.x, props.y, props.width, props.height);
        continue;

      case 'fillStyle':
        fillStyleStack.push(ctx.fillStyle);
        ctx.fillStyle = props.value;
        continue;

      case 'strokeStyle':
        strokeStyleStack.push(ctx.strokeStyle);
        ctx.strokeStyle = props.value;
        continue;

      case 'endFillStyle':
        ctx.fillStyle = fillStyleStack.pop();
        continue;

      case 'endStrokeStyle':
        ctx.strokeStyle = strokeStyleStack.pop();
        continue;

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

      case 'strokeText':
        if (props.maxWidth) {
          ctx.strokeText(props.text, props.x, props.y, props.maxWidth);
          continue;
        }
        ctx.strokeText(props.text, props.x, props.y);
        continue;

      case 'fillText':
        if (props.maxWidth) {
          ctx.fillText(props.text, props.x, props.y, props.maxWidth);
          continue;
        }
        ctx.fillText(props.text, props.x, props.y);
        continue;

      case 'drawImage':
        ctx.drawImage(props.img, props.dx, props.dy);
        continue;

      case 'drawImageSize':
        ctx.drawImage(props.img, props.dx, props.dy, props.dWidth, props.dHeight);
        continue;

      case 'drawImageSource':
        ctx.drawImage(props.img, props.sx, props.sy, props.sWidth, props.sHeight, props.dx, props.dy, props.dWidth, props.dHeight);
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

      case 'moveTo':
        ctx.moveTo(props.x, props.y);
        continue;

      case 'lineTo':
        ctx.lineTo(props.x, props.y);
        continue;

      case 'bezierCurveTo':
        ctx.bezierCurveTo(props.cp1x, props.cp1y, props.cp2x, props.cp2y, props.x, props.y);
        continue;

      case 'quadraticCurveTo':
        ctx.quadraticCurveTo(props.cpx, props.cpy, props.x, props.y);
        continue;

      case 'arc':
        ctx.arc(props.x, props.y, props.r, props.startAngle, props.endAngle, props.counterclockwise);
        continue;

      case 'arcTo':
        ctx.arcTo(props.x1, props.y1, props.x2, props.y2, props.r);
        continue;

      case 'ellipse':
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

      case 'globalCompositeOperation':
        globalCompositeOperationStack.push(ctx.globalCompositeOperation);
        ctx.globalCompositeOperation = props.value;
        continue;

      case 'endGlobalCompositeOperation':
        ctx.globalCompositeOperation = globalCompositeOperationStack.pop();
        continue;

      case 'fill':
        ctx.fill();
        continue;

      case 'stroke':
        ctx.stroke();
        continue;

      case 'beginClip':
       ctx.save();
       ctx.beginPath();
       continue;

      case 'clip':
        ctx.clip();
        continue;

      case 'endClip':
        ctx.restore();
        continue;

      case 'beginPath':
        ctx.beginPath();
        continue;

      case 'closePath':
        ctx.closePath();
        continue;

      case 'globalAlpha':
        globalAlphaStack.push(ctx.globalAlpha);
        ctx.globalAlpha *= props.value;
        continue;

      case 'endGlobalAlpha':
        ctx.globalAlpha = globalAlphaStack.pop();
        continue;

      case 'hitRect':
        if (regions) {
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
        continue;

      case 'hitRegion':
        if (regions) {
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
        }
        continue;

      case 'imageSmoothingEnabled':
        imageSmoothingEnabledStack.push(ctx.imageSmoothingEnabled);
        ctx.imageSmoothingEnabled = props.value;
        continue;

      case 'endImageSmoothingEnabled':
        ctx.imageSmoothingEnabled = imageSmoothingEnabledStack.pop();
        continue;

      default:
        if (extensions && extensions[type]) {
          extensions[type](props, ctx);
        }
        continue;
    }
  }
};