import * as P from "pixi.js";
import { memo, useEffect, useRef } from "react";
import { useStage } from "./pixi-provider";
import { RectangleType } from "./rectangles";

type OnMove = (props: { uuid: string; diffX: number; diffY: number }) => void;
type OnStartDragging = (props: { uuid: string }) => void;
type OnStopDragging = (props: { uuid: string }) => void;

interface BlueRectangleComponentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  uuid: string;
  type: RectangleType;
  onMove?: OnMove | undefined;
  onStartDragging?: OnStartDragging | undefined;
  onStopDragging?: OnStopDragging | undefined;
}

function mapColor(type: RectangleType) {
  switch (type) {
    case RectangleType.Blue:
      return 0x0000ff;
    case RectangleType.Red:
      return 0xff0000;
    case RectangleType.Green:
      return 0x00ff00;
    case RectangleType.Yellow:
      return 0xffff00;
  }
}

function createGraphics(
  stage: P.Container,
  uuid: string,
  type: RectangleType,
  onMove?: OnMove | undefined,
  onStartDragging?: OnStartDragging | undefined,
  onStopDragging?: OnStopDragging | undefined
) {
  const rectangle = new P.Graphics();
  rectangle.beginFill(mapColor(type));
  rectangle.drawRoundedRect(10, 10, 100, 100, 5);
  rectangle.eventMode = "static";
  rectangle.cursor = "pointer";
  rectangle.pivot.set(50, 50);

  rectangle.on("pointerdown", () => {
    onStartDragging?.({ uuid });

    stage.on("pointermove", (e) => {
      onMove?.({
        uuid,
        diffX: e.movementX,
        diffY: e.movementY,
      });
    });

    stage.on("pointerup", () => {
      onStopDragging?.({ uuid });
      stage.off("pointermove");
      stage.off("pointerup");
    });
  });

  stage.addChild(rectangle);

  return rectangle;
}

function Component(props: BlueRectangleComponentProps) {
  const {
    x,
    y,
    width,
    height,
    uuid,
    onMove,
    type,
    onStartDragging,
    onStopDragging,
  } = props;

  const stage = useStage();

  const ref = useRef<P.Graphics>();

  useEffect(() => {
    const object = createGraphics(
      stage,
      uuid,
      type,
      onMove,
      onStartDragging,
      onStopDragging
    );

    ref.current = object;

    return () => {
      object.destroy();
    };
  }, [onMove, onStartDragging, onStopDragging, stage, type, uuid]);

  useEffect(() => {
    if (ref.current === undefined) {
      return;
    }

    ref.current.x = x;
    ref.current.y = y;
    ref.current.width = width;
    ref.current.height = height;
  }, [height, width, x, y]);

  return <></>;
}

export const RectangleComponent = memo(Component);
