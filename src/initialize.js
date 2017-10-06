const keycode = require('keycode');

module.exports = (ctx) => {
  const { canvas } = ctx;

  //mouseData
  canvas[Symbol.for('mouseData')] = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    previousX: 0,
    previousY: 0,
    state: false,
    clicked: 0
  };

  const keys = canvas[Symbol.for('keyData')] = {};

  for (const name in keycode.code) {
    if (keycode.code.hasOwnProperty(name)) {
      keys[name] = false;
    }
  }

  //mouse regions
  canvas[Symbol.for('regions')] = [];
  canvas[Symbol.for('mousePoints')] = [];

  //make the canvas receive touch and mouse events
  canvas.tabIndex = 1;

  const mouseMove = (evt) => {
    const { clientX, clientY } = evt;

    //get left and top coordinates
    const { left, top } = canvas.getBoundingClientRect();

    const mouseData = canvas[Symbol.for('mouseData')];

    const point = [clientX - left, clientY - top, mouseData.state];

    mouseData.x = point[0];
    mouseData.y = point[1];

    const points = canvas[Symbol.for('mousePoints')];

    points.push(point);

    //store the last 100 stored positions for hover detection
    if (points.length > 100) {
      points.splice(0, points.length - 100);
    }

    evt.preventDefault();
    return false;
  };

  //up target needs to detect mouse up and keyup events if the mouse leaves the canvas
  const upTarget = typeof window !== 'undefined' ? window : canvas;

  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('mousedown', (evt) => {
    const { target } = evt;
    if (target === canvas) {
      const mouseData = canvas[Symbol.for('mouseData')];

      if (!mouseData.state) {
        mouseData.clicked += 1;
      }

      mouseData.state = true;
      return mouseMove(evt);
    }
  });

  canvas.addEventListener('keydown', (evt) => {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = true;
    evt.preventDefault();
    return false;
  });


  upTarget.addEventListener('mouseup', (evt) => {
    const mouseData = canvas[Symbol.for('mouseData')];
    mouseData.state = false;
    mouseMove(evt);
  });

  upTarget.addEventListener('keyup', (evt) => {
    canvas[Symbol.for('keyData')][keycode(evt.keyCode)] = false;
    evt.preventDefault();
  });
};