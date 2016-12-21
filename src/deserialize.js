let consts = require('./consts');
let Instruction = require('./Instruction');

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
}

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
  }
  return tree;
};

module.exports = deserialize;