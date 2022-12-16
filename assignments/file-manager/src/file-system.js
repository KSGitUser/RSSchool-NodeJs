import process from 'node:process';
import {join, resolve, basename} from "node:path";
import { readdir} from "node:fs/promises";
import {createError, ERROR_CODES, getFullPath} from "./utils/fileOperationUtils.js";
const isCanChangeDir = (pathToNewDir) => {
    return !!basename(pathToNewDir);
}

export const up = () => {
    const currentDir = process.cwd();
    if (!isCanChangeDir(currentDir)) {
        return;
    }
    try {
        const newPath = join(currentDir, '../');
        process.chdir(newPath);
    } catch(error) {
        throw createError(error, ERROR_CODES.upErr);
    }
}

export const cd = async (path) => {
    const fullPath = getFullPath(path);
    try {
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
        throw createError(err, ERROR_CODES.lsErr);
    }
};
