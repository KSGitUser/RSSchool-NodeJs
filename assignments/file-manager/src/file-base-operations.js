import { open } from "node:fs/promises";
import {createError, ERROR_CODES, getFullPath} from "./utils/fileOperationUtils.js";

export const cat = async (pathToFile) => {
    const fullPathToFile = getFullPath(pathToFile);
    let openedFile;
    return new Promise(async (resolve, reject) => {
        try {
            openedFile = await open(fullPathToFile)
            const frs = openedFile.createReadStream({ encoding: "utf8", autoClose: true });
            frs.on('data', (data) => {
                process.stdout.write(data.toString());
            });

            frs.on('end', () => {
                openedFile?.close();
                resolve();
            });
        } catch (error) {
            openedFile?.close();
            reject(createError(error, ERROR_CODES.catErr));
        }
    })
}

export const add = async (fileName) => {
    let fileHandler;
    const fullPath = getFullPath(fileName);
    const data = "";

    try {
        fileHandler = await open(fullPath, "wx");
        await fileHandler.appendFile(data);
    } catch (error) {
        throw createError(error,ERROR_CODES.addErr);
    } finally {
        fileHandler?.close();
    }
};
