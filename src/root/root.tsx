import { useCallback, useEffect, useState } from "react";
import { RectangleComponent } from "./rectangle-component";
import { PixiProvider, usePixiApp } from "./pixi-provider";
import { Rectangle } from "./rectangles";

import { getRandomInitialState } from "./initial-state";
import { isStateValid } from "./invariants";
import { getRandomMover } from "./random-mover";

const initialState = getRandomInitialState(10);

const mover = getRandomMover();

const metrics: number[] = [];

function App() {
  const [rectangles, setRectangles] = useState<Rectangle[]>(initialState);
  const [selectedRectangle, setSelectedRectangle] = useState<string>(
    initialState[0].uuid
  );
  const [average, setAverage] = useState(0);
  const [fps, setFps] = useState(0);

  const app = usePixiApp();

  const handleStateUpdate = useCallback(
    (rectangles: Rectangle[]) => {
      const start = performance.now();

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

      const end = performance.now();
      const diff = end - start;
      metrics.push(diff);
      return rectangles;
    },
    [selectedRectangle]
  );

  const handleAddMore = useCallback(() => {
    setRectangles((rectangles) => {
      return getRandomInitialState(rectangles.length + 50, rectangles);
    });
  }, []);

  const randomSelection = useCallback(() => {
    const index = Math.floor(Math.random() * rectangles.length);
    const rectangle = rectangles[index];
    setSelectedRectangle(rectangle.uuid);
  }, [rectangles]);

  useEffect(() => {
    const handle = () => {
      setRectangles(handleStateUpdate);
    };

    app.ticker.add(handle);

    return () => {
      app.ticker.remove(handle);
    };
  }, [app, handleStateUpdate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (metrics.length === 0) {
        return;
      }

      const average =
        metrics.reduce((acc, value) => {
          return acc + value;
        }, 0) / metrics.length;

      setAverage(average);

      metrics.length = 0;
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [app]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFps(app.ticker.FPS);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [app]);

  return (
    <>
      <button
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          backgroundColor: "white",
          zIndex: 100,
        }}
        onClick={handleAddMore}
      >
        Add 50 ({rectangles.length})
      </button>
      <button
        style={{
          position: "absolute",
          top: 10,
          left: 200,
          backgroundColor: "white",
          zIndex: 100,
        }}
        onClick={randomSelection}
      >
        Select random
      </button>

      <div
        style={{
          position: "absolute",
          top: 10,
          left: 400,
          backgroundColor: "white",
          zIndex: 100,
        }}
      >
        Average check time: {average.toFixed(2)}ms
      </div>

      <div
        style={{
          position: "absolute",
          top: 10,
          left: 900,
          backgroundColor: "white",
          zIndex: 100,
        }}
      >
        FPS: {fps.toFixed(0)}
      </div>
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
