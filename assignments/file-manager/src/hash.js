import { createReadStream } from "node:fs";
import {createError, ERROR_CODES, getFullPath} from "./utils/fileOperationUtils.js";
import { createHash } from "node:crypto";
export const calculateHash = async (pathToFile) => {
  try {
    const fullPathToFile = getFullPath(pathToFile);
    const rs = createReadStream(fullPathToFile);
    const fileData = [];
    const hash = createHash("sha256");

    await new Promise((resolve, reject) => {
      rs.on("data", (data) => {
        fileData.push(data.toString());
      });
      rs.on("end", () => {
        hash.update(fileData.join(""));
        console.log(hash.digest("hex"));
        resolve();
      });
      rs.on("error", (err) => {
        reject(err);
      });
      hash.on("error", (err) => {
        reject(err);
      });
    });
  } catch (err) {
    throw throw createError(err, ERROR_CODES.hashErr);
  }
};
