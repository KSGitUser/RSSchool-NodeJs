import { down, left, mouse, right, up } from "@nut-tree/nut-js";
import { COMMANDS } from "./consts.js";

export const moveMouseUp = async (...args: number[]): Promise<string> => {
  await mouse.move(up(args[0] as number));
  return COMMANDS.mouse_up;
};

export const moveMouseDown = async (...args: number[]): Promise<string> => {
  await mouse.move(down(args[0] as number));
  return COMMANDS.mouse_down;
};

export const moveMouseLeft = async (...args: number[]): Promise<string> => {
  await mouse.move(left(args[0] as number));
  return COMMANDS.mouse_left;
};

export const moveMouseRight = async (...args: number[]): Promise<string> => {
  await mouse.move(right(args[0] as number));
  return COMMANDS.mouse_right;
};

export const mousePosition = async (): Promise<string> => {
  const points = await mouse.getPosition();
  const position = `${COMMANDS.mouse_position} ${Object.values(points).join(
    ","
  )}`;

  return position;
};
