import { down, left, mouse, right, up } from "@nut-tree/nut-js";
import type { MouseClass } from "@nut-tree/nut-js";

export enum COMMANDS {
  mouse_up = "mouse_up",
  mouse_down = "mouse_down",
  mouse_left = "mouse_left",
  mouse_right = "mouse_right",
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

export const nutFunctions = {
  [COMMANDS.mouse_up]: async (...args: number[]): Promise<MouseClass> =>
    mouse.move(up(args[0] as number)),
  [COMMANDS.mouse_down]: async (...args: number[]): Promise<MouseClass> =>
    mouse.move(down(args[0] as number)),
  [COMMANDS.mouse_left]: async (...args: number[]): Promise<MouseClass> =>
    mouse.move(left(args[0] as number)),
  [COMMANDS.mouse_right]: async (...args: number[]): Promise<MouseClass> =>
    mouse.move(right(args[0] as number)),
};
