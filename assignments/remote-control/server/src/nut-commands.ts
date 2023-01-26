import {
  mousePosition,
  moveMouseDown,
  moveMouseLeft,
  moveMouseRight,
  moveMouseUp,
} from "./move-cursor.js";
import { drawCircle, drawRectangle } from "./draw-figures.js";
import { prntScrn } from "./screen-actions.js";
import { COMMANDS } from "./consts.js";

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
