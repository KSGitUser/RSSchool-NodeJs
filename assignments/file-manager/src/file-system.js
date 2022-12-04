import process from 'node:process';
import { join, resolve, sep } from "node:path";
import {access, readdir} from "node:fs/promises";
import os from "node:os";

const ERROR_CODES = {
    operationErr: 'OPERATION_ERR',
    upErr: 'FS_UP_ERR',
    cdErr: 'FS_CD_ERR'
}

const createErr = (code = 'OPERATION_ERR') => {
    const err = new Error("Operation failed");
    err.code = 'OPERATION_ERR'
    return err;
}
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
        throw createErr(ERROR_CODES.upErr);
    }
}

export const cd = async (path) => {
    if (!isCanChangeDir(path)) {
        return;
    }
    try {
        await access(resolve(path));
        process.chdir(resolve(path));
    } catch (error) {
        throw createErr(ERROR_CODES.cdErr);
    }
}

const setDirectoryParam = (fileList = []) => {
    const FILE_TYPE = {
        directory: 'directory',
        file: 'file'
    }
    const sortFilesFunc = (a,b) => {
        if (a.type === b.type) {
            return 0
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
