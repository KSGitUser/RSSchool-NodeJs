import http from "node:http"
import dataBaseData from "./db/dataBase.js";
import BaseError from "./errors/BaseError.js";
import url from 'node:url';
import {PATH_NAMES, PORT} from './consts.js';
// const db = {}
const { STATUS_CODES } = http



// const getUuidFromPath = (pathname: string): string => {
//     return pathname.split('/')?.[4] || '';
// }

const getBasePathname = (pathnameArr:string[]):string => {
    if (pathnameArr.length >= 2) {
        return pathnameArr.slice(0,2).join('/');
    }
    return '';
}

export const serverHandler = (req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & {req: http.IncomingMessage},dataBase: typeof dataBaseData = dataBaseData) => {
    let { pathname } = url.parse(req?.url || '');
    pathname = (pathname || '').endsWith('/') ? (pathname || '').slice(1,-1) : (pathname || '');
    let pathnameArr: string[] = pathname.slice(1).split('/')



    if (getBasePathname(pathnameArr) === PATH_NAMES.USERS) {
        res.setHeader('Content-Type', 'application/json');
        if (pathnameArr.length === 2) {
            if (req.method === "GET") {
                const usersData = dataBase.readAll()
                res.end(JSON.stringify([...usersData]))
                return
            }

            if (req.method === "POST") {
                let jsonString = ''

                req.on('data', function (data) {
                    jsonString += data
                });

                req.on('end', function () {
                    try {
                        const parsedData = JSON.parse(jsonString)
                        const userData = dataBase.createItem(parsedData);
                        res.statusCode = 201;
                        res.end(JSON.stringify({...userData}));
                        return;
                    } catch(error: any) {
                        if (!error.code) {
                            res.end((new BaseError(500, `${STATUS_CODES[500]} - ${error?.message}`)).stringify())
                            return;
                        }
                        res.statusCode = error.code;
                        res.end((error as BaseError).stringify())
                        return;
                    }
                });

                req.on('error', (error) => {
                    res.end((new BaseError(500, `${STATUS_CODES[500]} - ${error?.message}`)).stringify())
                    return;
                })
                return;
            }
        }

        if (pathnameArr.length >= 3) {
            const pathUuid: string =  pathnameArr[2] || ''
            if (req.method === 'GET') {
                try {
                    const userData = dataBase.readItem(pathUuid)
                    res.end(JSON.stringify({...userData}))
                    return;
                } catch(error: any) {
                    if (error) {
                        if (!error.code) {
                            res.end((new BaseError(500, `${STATUS_CODES[500]} - ${error?.message}`)).stringify())
                            return;
                        }
                        res.statusCode = +(error as BaseError).code
                        res.end((error as BaseError).stringify())
                        return;
                    }
                }
            }

            if (req.method === "PUT") {
                let jsonString = ''

                req.on('data', function (data) {
                    jsonString += data
                });

                req.on('end', function () {
                    try {
                        const parsedData = JSON.parse(jsonString)
                        const userData = dataBase.updateItem({ ...parsedData, id: pathUuid});
                        res.end(JSON.stringify({...userData}));
                        return;
                    } catch(error: any) {
                        if (!error.code) {
                            res.end((new BaseError(500, `${STATUS_CODES[500]} - ${error?.message}`)).stringify())
                            return;
                        }
                        res.statusCode = error.code;
                        res.end((error as BaseError).stringify())
                        return;
                    }
                });
                
            }

            if (req.method === "DELETE") {
                try {
                    dataBase.deleteItem(pathUuid);
                    res.statusCode = 204
                    res.end();
                    return;
                } catch(error: any) {
                    if (!error.code) {
                        res.end((new BaseError(500, `${STATUS_CODES[500]} - ${error?.message}`)).stringify())
                        return;
                    }
                    res.statusCode = error.code;
                    res.end((error as BaseError).stringify())
                    return;
                }
            }
            req.on('error', (error) => {
                res.end((new BaseError(500, `${STATUS_CODES[500]} - ${error?.message}`)).stringify())
                return;
            })
            return;
        }

    }
    res.statusCode = 404;
    res.end((new BaseError(404, `${STATUS_CODES[404]} - wrong endpoint`)).stringify());
}

export const server = http.createServer((req, res) => serverHandler(req, res));

export const startServer = (cb = () => console.log(`Server started at: http://localhost:${PORT}`)) => {
    server.listen(PORT, cb);
}

export const closeServer = (cb = () =>{}) => {
    server.close(cb);
}
