import http from "node:http"
import dataBase from "./db/dataBase.js";
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

const server = http.createServer((req, res) => {
    console.log("Server start")
    // eslint-disable-next-line no-console
    console.log('req.method =>', req.method);
    let { pathname } = url.parse(req?.url || '');
    pathname = (pathname || '').endsWith('/') ? (pathname || '').slice(1,-1) : (pathname || '');
    let pathnameArr: string[] = pathname.slice(1).split('/')



    if (getBasePathname(pathnameArr) === PATH_NAMES.USERS) {
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
                        res.end(JSON.stringify({...userData}));
                        return;
                    } catch(error: any) {
                        res.statusCode = error.code || 400
                        res.end(error.message)
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
                } catch(error) {
                    if (error) {
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
                        res.statusCode = error.code || 400
                        res.end(error.message)
                        return;
                    }
                });
                
            }

            if (req.method === "DELETE") {
                try {
                    dataBase.deleteItem(pathUuid);
                    res.end(`User with id:${pathUuid} was deleted`);
                    return;
                } catch(error: any) {
                    res.statusCode = error.code || 400
                    res.end(error.message)
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


    // res.end('Hello from server')
})

export const startServer = () => {
    server.listen(PORT);
    console.log(`Server started at: http://localhost:${PORT}`)
}

export const closeServer = (cb: () => void) => {
    server.close(cb)
}
