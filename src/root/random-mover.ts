function getMoveVector(angle: number, distance: number) {
  const radians = (angle * Math.PI) / 180;

  return {
    x: Math.cos(radians) * distance,
    y: Math.sin(radians) * distance,
  };
}

export function getRandomMover() {
  let moveAngle = 90;
  let randomDirection = Math.random() > 0.5 ? 1 : -1;

  const moveDistance = 5;

  return {
    getNextVector() {
      moveAngle += randomDirection * 3;

      if (Math.random() > 0.91) {
        randomDirection = Math.random() > 0.5 ? 1 : -1;
      }

      return getMoveVector(moveAngle, moveDistance);
    },
    makeDrasticChange() {
      moveAngle = Math.random() * 360;
      randomDirection = Math.random() > 0.5 ? 1 : -1;
    },
  };
}
