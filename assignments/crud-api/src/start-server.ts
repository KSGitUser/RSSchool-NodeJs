import http from "node:http"
import {User} from "./models/User.js";
import dataBase from "./db/dataBase.js";
const PORT =  3000
// const db = {}
const { STATUS_CODES } = http

const server = http.createServer((req, res) => {
    console.log("Server start")
    // eslint-disable-next-line no-console
    console.log('req.method =>', req.method);
    if (req.method === "POST") {
        let jsonString = ''

        req.on('data', function (data) {
            jsonString += data
        });

        req.on('end', function () {
            console.log(JSON.parse(jsonString))
            
            const parsedData = JSON.parse(jsonString)

            try {
                const newUser = new User(parsedData)
                dataBase.addItem(newUser);
                // eslint-disable-next-line no-console
                console.log('newUser =>', newUser);
                res.end(JSON.stringify({ size: dataBase.getSize(), user:newUser}));
            } catch(error) {
                // eslint-disable-next-line no-console
                console.log('error =>', error);
                res.statusCode = 400
                console.error(STATUS_CODES[400])
                res.end(STATUS_CODES[400])
            }
        });
    }
    // res.end('Hello from server')
})

export const startServer = () => {
    server.listen(PORT);
}
