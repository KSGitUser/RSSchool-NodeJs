import {open, rename as renameFile} from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";
import {createError, ERROR_CODES, FILE_OPERATION_FLAGS, getFullPath, isFileExist} from "./utils/fileOperationUtils.js";
import {join, parse} from "node:path";
import { pipeline } from "node:stream"
import fsPromise from "node:fs/promises";

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

export const cp = async (pathToCopyingFile, pathToNewFile) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fullPathToCopyingFile = getFullPath(pathToCopyingFile);
            const { base } = parse(fullPathToCopyingFile);
            const fullPathToNewFile = getFullPath(join(pathToNewFile, base));
            const fileReadStream = createReadStream(fullPathToCopyingFile);
            const fileWriteStream = createWriteStream(fullPathToNewFile, { flags: FILE_OPERATION_FLAGS.openForWritingIfExist});
            pipeline(fileReadStream, fileWriteStream, (error) => {
               if (error) {
                   reject(createError(error, ERROR_CODES.cpErr));
               }
                resolve();
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('error =>', error);
            reject(createError(error, ERROR_CODES.cpErr));
        }
    })
}

export const rm = async (pathToRmFile) => {
    try {
        const fullPathToRmFile = getFullPath(pathToRmFile);
        await fsPromise.rm(fullPathToRmFile);
    } catch(error) {
        throw createError(error, ERROR_CODES.rmErr)
    }
}

export const mv = async (pathToCopyingFile, pathToNewFile) => {
    try {
        const fullPathToCopyingFile = getFullPath(pathToCopyingFile);
        await cp(pathToCopyingFile, pathToNewFile);
        await rm(fullPathToCopyingFile);
    } catch (error) {
        throw createError(error, ERROR_CODES.mvErr)
    }
}
