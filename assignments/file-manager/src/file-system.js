import process from 'node:process';
import { join, resolve, sep } from "node:path";
import {access, readdir} from "node:fs/promises";
import os from "node:os";
import {createError, ERROR_CODES, getFullPath} from "./utils/fileOperationUtils.js";
const isCanChangeDir = (pathToNewDir) => {
    const homeDir = os.homedir();
    const homeDirLength = homeDir.split(sep).length;
    const pathToNewDirLength = pathToNewDir.split(sep).length;
    if (pathToNewDir.startsWith(homeDir)) {
        return homeDirLength < pathToNewDirLength;
    }
    return false;
}

export const up = () => {
    const currentDir = process.cwd();
    const newPath = join(currentDir, '../');
    if (!isCanChangeDir(newPath)) {
        return;
    }

    try {
        process.chdir(newPath);
    } catch(error) {
        throw createError(error, ERROR_CODES.upErr);
    }
}

export const cd = async (path) => {
    const fullPath = getFullPath(path);
    if (!isCanChangeDir(fullPath)) {
        return;
    }
    try {
        await access(resolve(fullPath));
        process.chdir(resolve(fullPath));
    } catch (error) {
        throw createError(error, ERROR_CODES.cdErr);
    }
}

const setDirectoryParam = (fileList = []) => {
    const FILE_TYPE = {
        directory: 'directory',
        file: 'file'
    }
    const sortFilesFunc = (a,b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name)
        }
        if (a.type === FILE_TYPE.directory && a.type !== b.type) {
            return -1;
        } else {
            return 1;
        }
    }

    return fileList.map(fileDirent => ({
      name: fileDirent.name, type: fileDirent.isDirectory() ? FILE_TYPE.directory : FILE_TYPE.file
    })).sort(sortFilesFunc)
}

export const ls = async () => {
    const currentDir = process.cwd();

    try {
        const files = await readdir(currentDir, { withFileTypes: true });
        console.table(setDirectoryParam(files));

    } catch (err) {
        if (err.code === "ENOENT") {
            throw new Error("FS operation failed");
        }
        throw err;
    }
};
