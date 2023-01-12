import cluster from 'cluster';
import dataBase from "./src/db/dataBase.js";
import http from "node:http";
import {serverHandler} from "./src/start-server.js";
import {cpus} from 'os';

const numCPUs = cpus().length - 1;

let workers:any = [];
let innerDataBase = dataBase;
function masterProcess() {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        let worker = cluster.fork();
        workers.push(worker);
             worker.on('message', function(message) {
                   innerDataBase.mapFromEntries(JSON.parse(message.data));
                 workers.forEach((worker:any) => {
                     worker.send({ data: JSON.stringify(innerDataBase.getDbEntries()) });
                 });
              });

    }

    cluster.on('exit', (worker, ...args) => {
        console.log('Cluster on exit =>', worker.id, ...args)
    })
    let currentRequest = 1

    http.createServer((req:any, res) => {
        res.setHeader('Content-Type', 'application/json');
        const headers = new Headers(req.headers)
        const url = new URL(`http://${headers.get('host')}${req.url}`);
        url.port = 4000 + currentRequest + '';
   
        if (currentRequest < numCPUs) {
            currentRequest += 1;
        } else {
            currentRequest = 1;
        }
        let requestData = '';

        req.on('data', (data:any) => {
            requestData += data.toString();
        })


        req.on('end', async () => {
           fetch(url, { body: req.method !== 'GET' ? requestData : null, method: req.method })
               .then((result) => result.json())
               .then((data) => res.end(JSON.stringify(data)));
        })

        res.on("finish", () => {
            workers.forEach((worker:any) => {
                worker.send({ data: JSON.stringify(innerDataBase.getDbEntries()) });
            });
        })
    }).listen(4000, ()=>console.log(`${4000} server`))
}

function childProcess() {
    process.on('message', function(message:any) {
        innerDataBase.mapFromEntries(JSON.parse(message.data));
    });
    const id = cluster?.worker?.id || 1
    const port = 4000 + id;

    http.createServer((req, res) => {
        serverHandler(req, res, innerDataBase)

        res.on("finish",
            () => {
                // @ts-ignore
                process.send({
                    msg: `Message from worker ${process.pid}`,
                    data: JSON.stringify(innerDataBase.getDbEntries())
                });
            })
    }).listen(port, ()=>Promise.resolve(console.log(`Listener http://localhost:${port} server`)))
}

if (cluster.isPrimary) {
    masterProcess();
} else {
    childProcess()
}




