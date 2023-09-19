import { v4 } from "uuid";

export enum RectangleType {
  Blue,
  Red,
  Green,
  Yellow,
}

interface RectangleBase {
  uuid: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BlueRectangle extends RectangleBase {
  type: RectangleType.Blue;
}

interface RedRectangle extends RectangleBase {
  type: RectangleType.Red;
}

interface GreenRectangle extends RectangleBase {
  type: RectangleType.Green;
}

interface YellowRectangle extends RectangleBase {
  type: RectangleType.Yellow;
}

export type Rectangle =
  | BlueRectangle
  | RedRectangle
  | GreenRectangle
  | YellowRectangle;

function getRandomType(): RectangleType {
  const colors = [
    RectangleType.Blue,
    RectangleType.Red,
    RectangleType.Green,
    RectangleType.Yellow,
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

export function createRandomRectangle(props: {
  x: number;
  y: number;
}): Rectangle {
  const { x, y } = props;

  return {
    type: getRandomType(),
    uuid: v4(),
    title: "Blue",
    x,
    y,
    width: 5,
    height: 5,
  };
}
