interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getRectangleCenter(rectangle: Rectangle): [number, number] {
  const { x, y, width, height } = rectangle;

  return [x + width / 2, y + height / 2];
}

function getRectangleArea(rectangle: Rectangle): number {
  const { width, height } = rectangle;

  return width * height;
}

function getRectangleDistance(
  rectangle1: Rectangle,
  rectangle2: Rectangle
): number {
  const [x1, y1] = getRectangleCenter(rectangle1);
  const [x2, y2] = getRectangleCenter(rectangle2);

  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function isRectangleInsideBoundary(
  rectangle: Rectangle,
  boundary: Rectangle
): boolean {
  const { x, y, width, height } = rectangle;
  const { x: bx, y: by, width: bwidth, height: bheight } = boundary;

  return (
    x >= bx && y >= by && x + width <= bx + bwidth && y + height <= by + bheight
  );
}

function areRectanglesOverlapping(
  rectangle1: Rectangle,
  rectangle2: Rectangle
): boolean {
  const { x, y, width, height } = rectangle1;
  const { x: x2, y: y2, width: width2, height: height2 } = rectangle2;

  return (
    x < x2 + width2 && x + width > x2 && y < y2 + height2 && y + height > y2
  );
}

export const Geometry = {
  getRectangleCenter,
  getRectangleArea,
  getRectangleDistance,
  isRectangleInsideBoundary,
  areRectanglesOverlapping,
};
