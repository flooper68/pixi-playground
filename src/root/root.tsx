import { useEffect, useState } from "react";
import { RectangleComponent } from "./rectangle-component";
import { PixiProvider, usePixiApp } from "./pixi-provider";
import { Rectangle } from "./rectangles";

import { getRandomInitialState } from "./initial-state";
import { isStateValid } from "./invariants";
import { getRandomMover } from "./random-mover";

const initialState = getRandomInitialState(800);

const selectedRectangle = initialState[0].uuid;

const mover = getRandomMover();

function handleStateUpdate(rectangles: Rectangle[]): Rectangle[] {
  const newVector = mover.getNextVector();

  const newState = rectangles.map((rectangle) => {
    if (rectangle.uuid === selectedRectangle) {
      return {
        ...rectangle,
        x: rectangle.x + newVector.x,
        y: rectangle.y + newVector.y,
      };
    }

    return rectangle;
  });

  if (isStateValid(newState)) {
    return newState;
  }

  mover.makeDrasticChange();

  return rectangles;
}

function App() {
  const [rectangles, setRectangles] = useState<Rectangle[]>(initialState);

  const app = usePixiApp();

  useEffect(() => {
    const handle = () => {
      const start = performance.now();
      setRectangles(handleStateUpdate);
      const end = performance.now();
      const diff = end - start;
      console.log(`The loop took ${diff}ms`);
    };

    app.ticker.add(handle);

    return () => {
      app.ticker.remove(handle);
    };
  }, [app]);

  return (
    <>
      {rectangles.map((rectangle) => {
        return (
          <RectangleComponent
            key={rectangle.uuid}
            uuid={rectangle.uuid}
            x={rectangle.x}
            y={rectangle.y}
            width={rectangle.width}
            height={rectangle.height}
            type={rectangle.type}
          />
        );
      })}
    </>
  );
}

export function Root() {
  return (
    <PixiProvider>
      <App />
    </PixiProvider>
  );
}
