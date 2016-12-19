let createRegularPolygon = require('./src/createRegularPolygon');
let activeRegions = require('./src/activeRegions');
let activeRegionsTest = require('./src/activeRegionsTest');

let chance = require('chance')();
let id = 0;
let createRegion = (sides) => ({
  id: ++id,
  points: createRegularPolygon(1, [0, 0], sides),
  matrix: [2, 0, 0, 2, 50, 50],
  hover: false,
  touched: false,
  clicked: false
});

let realPoint =[50.5, 51];
let blankPoint = [0, 0];

let ctx = {
  canvas: {
    [Symbol.for('regions')]: [],
    [Symbol.for('mousePoints')]: [
      //blankPoint,
      //blankPoint,
      realPoint
    ],
    [Symbol.for('mouseData')]: { x: 50, y: 50, state: false }
  }
};
let testID = 0;
let runTest = (sideCount, threshold) => {
  let results = {
    testID: ++testID,
    sideCount,
    threshold,
    activeRegions: 0,
    activeRegionsTest: 0
  };
  let regions = ctx.canvas[Symbol.for('regions')] = [];

  let chanceProps = { min: 3, max: sideCount };
  for(let i = 0; i < 200; i++)
    regions.push(createRegion(chance.integer(chanceProps)));

  let start = process.hrtime(), end;
  for (let i = 1; i < 10000; i++) {
    activeRegions(ctx);
  }
  end = process.hrtime(start);
  results.activeRegions = (end[0] * 1000 + end[1] / 1000000) / 10000;

  start = process.hrtime();
  for (let i = 1; i < 10000; i++) {
    activeRegionsTest(ctx);
  }
  end = process.hrtime(start);
  results.activeRegionsTest = (end[0] * 1000 + end[1] / 1000000) / 10000;

  return results;
};

let series = [
  { name: 'activeRegionsTransformPolygon', data: [] },
  { name: 'activeRegionsTransformMouse', data: [] },
];
let data = [];
for(let i = 5; i <= 20; i++) {
  data.push(runTest(i));
}
data.forEach(
  (result) => {
    series[0].data.push([result.sideCount, result.activeRegions, 1]);
    series[1].data.push([result.sideCount, result.activeRegionsTest, 1]);
  }
);
require('fs').writeFileSync('./results.json', JSON.stringify(series));