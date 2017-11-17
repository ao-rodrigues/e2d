const ctx = CanvasRenderingContext2D.prototype.currentTransform
  ? document.createElement('canvas').getContext('2d')
  : null;
let det = 0;
const invertMatrix = ctx
  ? ([a, b, c, d, e, f]) => {
      ctx.setTransform(a, b, c, d, e, f);
      ({ a, b, c, d, e, f } = ctx.currentTransform.inverse());
      return [a, b, c, d, e, f];
    }
  : ([a, b, c, d, e, f]) => (
      (det = 1 / (a * d - c * b)),
      [d * det, -c * det, -b * det, a * det, (b * f - e * d) * det, (e * b - a * f) * det]
    );
export default invertMatrix;
