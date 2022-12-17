import http from "node:http"
import dataBase from "./db/dataBase.js";
import BaseError from "./errors/BaseError.js";
import url from 'node:url';
const PORT =  3000
// const db = {}
const { STATUS_CODES } = http

const BASE_PATH = '/api/users'

// const getUuidFromPath = (pathname: string): string => {
//     return pathname.split('/')?.[4] || '';
// }

const server = http.createServer((req, res) => {
    console.log("Server start")
    // eslint-disable-next-line no-console
    console.log('req.method =>', req.method);
    let { pathname } = url.parse(req?.url || '');
    pathname = (pathname || '').endsWith('/') ? (pathname || '').slice(0,-1) : pathname;


    // eslint-disable-next-line no-console
    console.log('parsedUrl =>', pathname);

    if (pathname === BASE_PATH) {
        if (req.method === "GET") {
            const usersData = dataBase.readAll()
            res.end(JSON.stringify([...usersData]))
            return
        }
    }

    if (req.method === "POST") {
        let jsonString = ''

        req.on('data', function (data) {
            jsonString += data
        });

        req.on('end', function () {

            const parsedData = JSON.parse(jsonString)

            try {
                const userData = dataBase.createItem(parsedData);
                res.end(JSON.stringify({...userData}));
            } catch(error: any) {
                res.statusCode = error.code || 400
                res.end(error.message)
            }
        });

        req.on('error', (error) => {
            res.end(new BaseError(500, `${STATUS_CODES[500]} - ${error?.message}`))
        })
    }


    // res.end('Hello from server')
})

export const startServer = () => {
    server.listen(PORT);
}
