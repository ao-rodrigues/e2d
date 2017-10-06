const ctx = document.createElement('canvas').getContext('2d');
ctx.canvas.width = 800;
ctx.canvas.height = 600;
document.body.appendChild(ctx.canvas);

e2d.initialize(ctx);

e2d.raf(x => {
  e2d.render(
    e2d.clearRect(800, 600),
    e2d.translate(100, 100,
      e2d.fillText("Hello world!"),
      e2d.fillText("Hello other world", 100, 100),
      e2d.fillText("Hello min world", 200, 200, 20)
    ),
    ctx
  )
});