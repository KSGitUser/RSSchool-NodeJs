import {
  down,
  left,
  mouse,
  Point,
  Region,
  right,
  screen,
  up,
} from "@nut-tree/nut-js";

import Jimp from "jimp";

export enum COMMANDS {
  mouse_up = "mouse_up",
  mouse_down = "mouse_down",
  mouse_left = "mouse_left",
  mouse_right = "mouse_right",
  draw_rectangle = "draw_rectangle",
  draw_square = "draw_square",
  draw_circle = "draw_circle",
  mouse_position = "mouse_position",
  prnt_scrn = "prnt_scrn",
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

  return [foundCommand];
};

const moveMouseUp = async (...args: number[]): Promise<void> => {
  await mouse.move(up(args[0] as number));
};

const moveMouseDown = async (...args: number[]): Promise<void> => {
  await mouse.move(down(args[0] as number));
};

const moveMouseLeft = async (...args: number[]): Promise<void> => {
  await mouse.move(left(args[0] as number));
};

const moveMouseRight = async (...args: number[]): Promise<void> => {
  await mouse.move(right(args[0] as number));
};

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

const drawCircle = async (...args: number[]): Promise<void> => {
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

const mousePosition = async (): Promise<string> => {
  const points = await mouse.getPosition();
  const position = `${COMMANDS.mouse_position} ${Object.values(points).join(
    ","
  )}`;

  return position;
};

const prntScrn = async (): Promise<string> => {
  const points = await mouse.getPosition();
  const regionToGrab = new Region(points.x - 100, points.y - 100, 200, 200);
  const region = await screen.grabRegion(regionToGrab);
  const image = new Jimp(region);

  const base64string = await image.getBase64Async(Jimp.MIME_PNG);
  const base64prefixFree = base64string.replace("data:image/png;base64,", "");

  return `${COMMANDS.prnt_scrn} ${base64prefixFree}`;
};

export const nutFunctions = {
  [COMMANDS.mouse_up]: moveMouseUp,
  [COMMANDS.mouse_down]: moveMouseDown,
  [COMMANDS.mouse_left]: moveMouseLeft,
  [COMMANDS.mouse_right]: moveMouseRight,
  [COMMANDS.draw_rectangle]: drawRectangle,
  [COMMANDS.draw_square]: drawRectangle,
  [COMMANDS.draw_circle]: drawCircle,
  [COMMANDS.mouse_position]: mousePosition,
  [COMMANDS.prnt_scrn]: prntScrn,
};
