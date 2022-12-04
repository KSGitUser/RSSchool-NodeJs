import {isAbsolute, join, resolve} from "node:path";
import process from "node:process";

export const getFullPath = (path) => {
    if (isAbsolute(path)) {
        return resolve(path);
    }
    return resolve(join(process.cwd(), path));
}

export const ERROR_CODES = {
    operationErr: 'OPERATION_ERR',
    upErr: 'FS_UP_ERR',
    cdErr: 'FS_CD_ERR',
    catErr: 'FBO_CAT_ERR',
    addErr: 'FBO_ADD_ERR',
}

export const createError = (error, localCode = 'OPERATION_ERR', message = "Operation failed") => {
    const err = error || new Error();
    err.message = message;
    err.code = err.code || 'OPERATION_ERR'
    err.localCode = localCode;
    return err;
}
