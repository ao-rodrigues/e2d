const t = CanvasRenderingContext2D.prototype.currentTransform
  ? document.createElement('canvas').getContext('2d').currentTransform
  : null;
let det = 0;
const invertMatrix = t
  ? ([a, b, c, d, e, f]) => {
      t.a = a;
      t.b = b;
      t.c = c;
      t.d = d;
      t.e = e;
      t.f = f;
      ({ a, b, c, d, e, f } = t.inverse());
      return [a, b, c, d, e, f];
    }
  : ([a, b, c, d, e, f]) => (
      (det = 1 / (a * d - c * b)),
      [d * det, -c * det, -b * det, a * det, (b * f - e * d) * det, (e * b - a * f) * det]
    );
export default invertMatrix;
