import { isStateValid } from "./invariants";
import { createRandomRectangle } from "./rectangles";

export function getRandomInitialState(amount: number) {
  let count = 0;

  const initialState = [
    createRandomRectangle({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }),
  ];

  while (initialState.length < amount) {
    count += 1;

    if (count > 1000) {
      throw new Error("Could not generate initial state");
    }

    console.log(`Trying to add another rectangle, ${initialState.length}`);

    const newRectangle = createRandomRectangle({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    });

    initialState.push(newRectangle);

    if (!isStateValid(initialState)) {
      initialState.pop();
      console.log("Invalid state, trying again");
    }
  }

  return initialState;
}
