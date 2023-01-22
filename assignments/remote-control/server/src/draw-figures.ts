import { down, left, mouse, Point, right, up } from "@nut-tree/nut-js";
import { moveMouseRight } from "./move-cursor.js";

export const drawRectangle = async (...args: number[]): Promise<void> => {
  let [width, height] = args;
  if (!width && !height) {
    return;
  }

  if (width && !height) {
    height = width;
  }
  await mouse.drag(right(width as number));
  await mouse.drag(down(height as number));
  await mouse.drag(left(width as number));
  await mouse.drag(up(height as number));
};

export const drawCircle = async (...args: number[]): Promise<void> => {
  const [radius] = args;
  if (!radius) {
    return;
  }
  const { x: centerX, y: centerY } = await mouse.getPosition();

  const numPoints = 1440;
  await moveMouseRight(radius);

  const circlePath = [];

  for (let i = 0; i <= numPoints; i++) {
    const angle = i * ((2 * Math.PI) / numPoints);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    circlePath.push(new Point(x, y));
  }
  await mouse.drag(circlePath);
};
