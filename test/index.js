const ctx = document.createElement('canvas').getContext('2d');
ctx.canvas.width = 800;
ctx.canvas.height = 600;
document.body.appendChild(ctx.canvas);

e2d.initialize(ctx);

e2d.raf(
  x => e2d.render(
    e2d.clearRect(800, 600),
    e2d.translate(100, 100,
      e2d.removeRegion('test'),
      e2d.path(
        e2d.rect(100, 100)
      ),
      e2d.hitRegion('test'),
      e2d.fillStyle(
        e2d.activeRegions(ctx).test ? 'red' : 'black',
        e2d.fill()
      )
    ),
    ctx
  )
);