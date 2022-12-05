import {isAbsolute, join, resolve} from "node:path";
import process from "node:process";
import {access} from "node:fs/promises";

export const getFullPath = (path, pathDir) => {
    if (isAbsolute(path)) {
        return resolve(path);
    }

    const fileDir = pathDir || process.cwd();
    return resolve(join(fileDir, path));
}

export const ERROR_CODES = {
    operationErr: 'OPERATION_ERR',
    upErr: 'FS_UP_ERR',
    cdErr: 'FS_CD_ERR',
    catErr: 'FBO_CAT_ERR',
    addErr: 'FBO_ADD_ERR',
    rnErr: "FBO_RN_ERR"
}

export const createError = (error, localCode = 'OPERATION_ERR', path, message = "Operation failed") => {
    const err = error || new Error();
    err.message = message;
    err.code = err.code || 'OPERATION_ERR'
    err.localCode = localCode;
    err.path = path;
    return err;
}

export const isFileExist = async (pathToFile) => {
    try {
        await access(pathToFile);
        return true;
    } catch {
        return false;
    }
}
