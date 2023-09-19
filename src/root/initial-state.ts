import { isStateValid } from "./invariants";
import { Rectangle, createRandomRectangle } from "./rectangles";

export function getRandomInitialState(amount: number, seed: Rectangle[] = []) {
  let count = 0;

  const initialState = [...seed];

  while (initialState.length < amount) {
    count += 1;

    if (count > 2000) {
      throw new Error("Could not generate initial state");
    }

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
