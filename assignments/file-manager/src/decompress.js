import {createReadStream, createWriteStream} from "node:fs";
import {pipeline} from "node:stream/promises";
import {createError, ERROR_CODES, getFullPath} from "./utils/fileOperationUtils.js";
import { createUnzip } from "node:zlib"

export const decompress = async (pathToSourceFile, pathToDestinationFile) => {
    const sourceFilePath = getFullPath(pathToSourceFile);
    const destinationFilePath = getFullPath(pathToDestinationFile);
    const unzip = createUnzip();
    const source = createReadStream(sourceFilePath);
    const destination = createWriteStream(destinationFilePath);

    try {
        await pipeline(source, unzip, destination);
    } catch (error) {
        throw createError(error, ERROR_CODES.decompressErr)
    }
};
