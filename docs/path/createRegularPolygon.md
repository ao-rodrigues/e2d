# createRegularPolygon.js

The purpose of the `createRegularPolygon` function is to create regular polygons with a few required
pieces of information.

```javascript
const polygon = e2d.createRegularPolygon(radius, (centerPoint = [x, y]), numberOfSides);
```

## Notes

This function returns an array of points that can be transformed with the
`e2d.transformPoints(points, matrix)` function. It's also possible to generate a canvas `path` from
a polygon. Example:

```javascript
const hexagon = e2d.createRegularPolygon(100, [0, 0], 6);
const hexagonPath = e2d.path(hexagon.map(e2d.moveToLineTo));
const fillRedHexagon = e2d.fillStyle('red', hexagonPath, e2d.fill());
```

## Source

```javascript
import Pi2 from './Pi2';
const createRegularPolygon = (radius = 0, position = [0, 0], sides = 3) => {
  const polygon = [];
  const factor = Pi2 / sides;
  for (let i = 0; i < sides; i++) {
    polygon.push([
      position[0] + radius * Math.cos(factor * i),
      position[1] + radius * Math.sin(factor * i),
    ]);
  }
  return polygon;
};

export default createRegularPolygon;
```
