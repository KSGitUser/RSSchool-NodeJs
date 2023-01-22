import { mouse, Region, screen } from "@nut-tree/nut-js";
import Jimp from "jimp";
import { COMMANDS } from "./consts.js";

export const prntScrn = async (): Promise<string> => {
  const points = await mouse.getPosition();
  const regionToGrab = new Region(points.x - 100, points.y - 100, 200, 200);
  const region = await screen.grabRegion(regionToGrab);
  const image = new Jimp(region);

  const base64string = await image.getBase64Async(Jimp.MIME_PNG);
  const base64prefixFree = base64string.replace("data:image/png;base64,", "");

  return `${COMMANDS.prnt_scrn} ${base64prefixFree}`;
};
