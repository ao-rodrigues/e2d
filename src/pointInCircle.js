const pointInCircle = ([x, y], [cx, cy, cr]) => ((cx - x) ** 2 + (cy - y) ** 2) < cr ** 2;

module.exports = pointInCircle;