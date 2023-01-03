import { createRequire } from "node:module";
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";
import {createError, ERROR_CODES, getFullPath} from "./utils/fileOperationUtils.js";

const requireCJS = createRequire(import.meta.url);
const { createGzip } = requireCJS("node:zlib");

export const compress = async (pathToSourceFile, pathToDestinationFile) => {
    const sourceFilePath = getFullPath(pathToSourceFile);
    const destinationFilePath = getFullPath(pathToDestinationFile)
    const gzip = createGzip();
    const source = createReadStream(sourceFilePath);
    const destination = createWriteStream(destinationFilePath);

    try {
        await pipeline(source, gzip, destination);
    } catch (error) {
        throw createError(error, ERROR_CODES.compressErr);
    }
};
