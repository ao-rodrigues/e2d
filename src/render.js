//initialize all the properties
const identity = [1, 0, 0, 1, 0, 0],
  concat = [].concat;

//transform points function
import transformPoints from './transformPoints';
import cycleMouseData from './cycleMouseData';

const PI2 = Math.PI * 2;

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

export default render;