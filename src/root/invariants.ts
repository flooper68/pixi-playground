import { Geometry } from "./geometry";
import { Rectangle, RectangleType } from "./rectangles";

const boundary = {
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
};

export function isStateValid(rectangles: Rectangle[]): boolean {
  const isAnyRectangleOutOfBounds = rectangles.some((rectangle) => {
    return !Geometry.isRectangleInsideBoundary(rectangle, boundary);
  });

  const isAnyRectangleColliding = rectangles.some((rectangle) => {
    return rectangles.some((otherRectangle) => {
      if (rectangle.uuid === otherRectangle.uuid) {
        return false;
      }

      return Geometry.areRectanglesOverlapping(rectangle, otherRectangle);
    });
  });

  const distanceBetweenClosestRectangles = rectangles.reduce(
    (acc, rectangle) => {
      return (
        acc +
        rectangles.reduce((acc, otherRectangle) => {
          if (rectangle.uuid === otherRectangle.uuid) {
            return acc;
          }

          const distance = Geometry.getRectangleDistance(
            rectangle,
            otherRectangle
          );

          if (distance < 20) {
            return acc + 1;
          }

          return acc;
        }, 0)
      );
    },
    0
  );

  const onlyFewCloseRectangles = distanceBetweenClosestRectangles < 1000;

  const redHasOnlyThreeBlueCloseBy = rectangles.every((rectangle) => {
    const isRed = rectangle.type === RectangleType.Red;

    if (!isRed) {
      return true;
    }

    const blueCloseByCount = rectangles.reduce((acc, otherRectangle) => {
      if (otherRectangle.type !== RectangleType.Blue) {
        return acc;
      }

      const distance = Geometry.getRectangleDistance(rectangle, otherRectangle);

      if (distance < 50) {
        return acc + 1;
      }

      return acc;
    }, 0);

    return blueCloseByCount < 200;
  });

  return (
    !isAnyRectangleOutOfBounds &&
    !isAnyRectangleColliding &&
    onlyFewCloseRectangles &&
    redHasOnlyThreeBlueCloseBy
  );
}
