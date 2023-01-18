import { down, left, mouse, Point, right, up } from "@nut-tree/nut-js";
import type { MouseClass } from "@nut-tree/nut-js";

export enum COMMANDS {
  mouse_up = "mouse_up",
  mouse_down = "mouse_down",
  mouse_left = "mouse_left",
  mouse_right = "mouse_right",
  draw_rectangle = "draw_rectangle",
  draw_square = "draw_square",
  draw_circle = "draw_circle",
}

export const parseCommands = (
  message: string
): [undefined] | [Partial<COMMANDS>, ...number[]] => {
  const [parsedCommandName, ...args] = message.split(" ");
  if (!parsedCommandName) {
    console.error("Wrong command");
    return [undefined];
  }
  const foundCommand = Object.values(COMMANDS).find(
    (commandName) => commandName === parsedCommandName
  ) as Partial<COMMANDS>;

  if (!foundCommand) {
    console.error("Wrong command");
    return [undefined];
  }

  if (args && args.length) {
    if (args.every((arg) => typeof +arg === "number")) {
      return [foundCommand, ...args.map((arg) => +arg)];
    }
  }

  console.error("Wrong command");
  return [undefined];
};

const moveMouseUp = async (...args: number[]): Promise<MouseClass> =>
  mouse.move(up(args[0] as number));

const moveMouseDown = async (...args: number[]): Promise<MouseClass> =>
  mouse.move(down(args[0] as number));

const moveMouseLeft = async (...args: number[]): Promise<MouseClass> =>
  mouse.move(left(args[0] as number));

const moveMouseRight = async (...args: number[]): Promise<MouseClass> =>
  mouse.move(right(args[0] as number));

const drawRectangle = async (...args: number[]): Promise<void> => {
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

const drawCircle = async (...args: number[]) => {
  const [radius] = args;
  if (!radius) {
    return;
  }
  const { x: centerX, y: centerY } = await mouse.getPosition();

  const numPoints = 90;
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

export const nutFunctions = {
  [COMMANDS.mouse_up]: moveMouseUp,
  [COMMANDS.mouse_down]: moveMouseDown,
  [COMMANDS.mouse_left]: moveMouseLeft,
  [COMMANDS.mouse_right]: moveMouseRight,
  [COMMANDS.draw_rectangle]: drawRectangle,
  [COMMANDS.draw_square]: drawRectangle,
  [COMMANDS.draw_circle]: drawCircle,
};
