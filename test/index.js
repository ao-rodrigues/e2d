const ctx = document.createElement('canvas').getContext('2d');
ctx.canvas.width = 800;
ctx.canvas.height = 600;
document.body.appendChild(ctx.canvas);

e2d.initialize(ctx);

e2d.raf(
  x => e2d.render(
    e2d.clearRect(800, 600),
    e2d.translate(100, 100,
      e2d.beginPath(),
      e2d.moveTo(100, 100),
      e2d.arcTo(150, 100, 60, 30, 20),
      e2d.fill(),
      e2d.fillStyle('red', e2d.fillArc(150, 100, 10)),
      e2d.fillStyle('red', e2d.fillArc(60, 30, 10)),
    ),
    ctx
  )
);