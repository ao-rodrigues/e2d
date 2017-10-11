const pointInRect =
  ( [ px, py ], [ [ x, y ], [ width, height ] ] ) => px > x && py > y && px < width && py < height;

export default pointInRect;
