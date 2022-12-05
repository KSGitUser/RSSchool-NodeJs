import {open, rename as renameFile} from "node:fs/promises";
import {createError, ERROR_CODES, getFullPath, isFileExist} from "./utils/fileOperationUtils.js";
import {parse} from "node:path";

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

export const rn = async (renamedFileName, newFileName) => {
    let pathToOriginalFile = null;
    let pathToRenamedFile;
    try {
        if (!renamedFileName || !newFileName) {
            throw createError(new Error(), ERROR_CODES.rnErr, pathToOriginalFile);
        }
        pathToOriginalFile = getFullPath(renamedFileName);
        let { dir }=  parse(renamedFileName);
        pathToRenamedFile = getFullPath(newFileName, dir);
        if (await isFileExist(pathToRenamedFile)) {
            throw createError(new Error(), ERROR_CODES.rnErr, pathToRenamedFile);
        } else {
            await renameFile(pathToOriginalFile, pathToRenamedFile);
        }
    } catch(err) {
        if (err.code === "ENOENT") {
            throw createError(err, ERROR_CODES.rnErr, pathToOriginalFile);
        }
        if (err.code === "EEXIST") {
            throw createError(err, ERROR_CODES.rnErr, pathToRenamedFile);
        }
        throw createError(err, ERROR_CODES.rnErr, pathToOriginalFile);
    }
};
