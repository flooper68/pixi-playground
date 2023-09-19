import { Geometry } from "./geometry";
import { Rectangle, RectangleType } from "./rectangles";

const boundary = {
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight,
};

const blockInTheMiddle = {
  x: 400,
  y: 100,
  width: 200,
  height: 400,
};

const yellowInTheMiddle = {
  x: 500,
  y: 300,
  width: 500,
  height: 500,
};

export function isStateValid(rectangles: Rectangle[]): boolean {
  const isAnyRectangleOutOfBounds = rectangles.some((rectangle) => {
    return !Geometry.isRectangleInsideBoundary(rectangle, boundary);
  });

  const isAnyInTheBox = rectangles.some((rectangle) => {
    return Geometry.areRectanglesOverlapping(rectangle, blockInTheMiddle);
  });

  const isAnyYellowInTheBox = rectangles.some((rectangle) => {
    if (rectangle.type !== RectangleType.Yellow) {
      return false;
    }

    return Geometry.areRectanglesOverlapping(rectangle, yellowInTheMiddle);
  });

  const isAnySameColorRectangleColliding = rectangles.some((rectangle) => {
    return rectangles.some((otherRectangle) => {
      if (rectangle.uuid === otherRectangle.uuid) {
        return false;
      }

      if (rectangle.type !== otherRectangle.type) {
        return false;
      }

      return Geometry.areRectanglesOverlapping(rectangle, otherRectangle);
    });
  });

  const isAnyRedColorRectangleCollidingWithGreen = rectangles.some(
    (rectangle) => {
      return rectangles.some((otherRectangle) => {
        if (rectangle.uuid === otherRectangle.uuid) {
          return false;
        }

        if (
          rectangle.type !== RectangleType.Red ||
          otherRectangle.type !== RectangleType.Green
        ) {
          return false;
        }

        return Geometry.areRectanglesOverlapping(rectangle, otherRectangle);
      });
    }
  );

  const amountOfRectanglesCloseTogether = rectangles.reduce(
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

  const onlyFewCloseRectangles = amountOfRectanglesCloseTogether < 1000;

  const redHasOnlyFewBlueCloseBy = rectangles.every((rectangle) => {
    const isRed = rectangle.type === RectangleType.Red;

    if (!isRed) {
      return true;
    }

    const blueCloseByCount = rectangles.reduce((acc, otherRectangle) => {
      if (otherRectangle.type !== RectangleType.Blue) {
        return acc;
      }

      const distance = Geometry.getRectangleDistance(rectangle, otherRectangle);

      if (distance < 100) {
        return acc + 1;
      }

      return acc;
    }, 0);

    return blueCloseByCount < 20;
  });

  const greensAreInGroupsWithoutYellows = rectangles.every((rectangle) => {
    if (rectangle.type !== RectangleType.Green) {
      return true;
    }

    const greenCloseByCount = rectangles.reduce((acc, otherRectangle) => {
      if (otherRectangle.type !== RectangleType.Green) {
        return acc;
      }

      const distance = Geometry.getRectangleDistance(rectangle, otherRectangle);

      if (distance < 300) {
        return acc + 1;
      }

      return acc;
    }, 0);

    const yellowCloseByCount = rectangles.reduce((acc, otherRectangle) => {
      if (otherRectangle.type !== RectangleType.Yellow) {
        return acc;
      }

      const distance = Geometry.getRectangleDistance(rectangle, otherRectangle);

      if (distance < 300) {
        return acc + 1;
      }

      return acc;
    }, 0);

    return greenCloseByCount > yellowCloseByCount;
  });

  const redAreInGroupsWithoutGreens = rectangles.every((rectangle) => {
    if (rectangle.type !== RectangleType.Red) {
      return true;
    }

    const redCloseByCount = rectangles.reduce((acc, otherRectangle) => {
      if (otherRectangle.type !== RectangleType.Red) {
        return acc;
      }

      const distance = Geometry.getRectangleDistance(rectangle, otherRectangle);

      if (distance < 300) {
        return acc + 1;
      }

      return acc;
    }, 0);

    const greenCloseByCount = rectangles.reduce((acc, otherRectangle) => {
      if (otherRectangle.type !== RectangleType.Green) {
        return acc;
      }

      const distance = Geometry.getRectangleDistance(rectangle, otherRectangle);

      if (distance < 300) {
        return acc + 1;
      }

      return acc;
    }, 0);

    return redCloseByCount > greenCloseByCount;
  });

  const redAreInGroupsWithoutYellows = rectangles.every((rectangle) => {
    if (rectangle.type !== RectangleType.Red) {
      return true;
    }

    const redCloseByCount = rectangles.reduce((acc, otherRectangle) => {
      if (otherRectangle.type !== RectangleType.Red) {
        return acc;
      }

      const distance = Geometry.getRectangleDistance(rectangle, otherRectangle);

      if (distance < 300) {
        return acc + 1;
      }

      return acc;
    }, 0);

    const yellowCloseByCount = rectangles.reduce((acc, otherRectangle) => {
      if (otherRectangle.type !== RectangleType.Yellow) {
        return acc;
      }

      const distance = Geometry.getRectangleDistance(rectangle, otherRectangle);

      if (distance < 300) {
        return acc + 1;
      }

      return acc;
    }, 0);

    return redCloseByCount > yellowCloseByCount;
  });

  return (
    !isAnyRectangleOutOfBounds &&
    !isAnySameColorRectangleColliding &&
    !isAnyInTheBox &&
    !isAnyRedColorRectangleCollidingWithGreen &&
    !isAnyYellowInTheBox &&
    onlyFewCloseRectangles &&
    redAreInGroupsWithoutGreens &&
    redAreInGroupsWithoutYellows &&
    greensAreInGroupsWithoutYellows &&
    redHasOnlyFewBlueCloseBy
  );
}
