import cluster from 'cluster';
import dataBase from "./src/db/dataBase.js";
import http from "node:http";
import {serverHandler} from "./src/start-server.js";
import {cpus} from 'os';

const numCPUs = cpus().length - 1;

let workers:any = [];
let innerDataBase = dataBase;
const mainPort = +(process.env['MULTI_PORT'] || 4000);
function masterProcess() {
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

    http.createServer((req, res) => {
        const headers = new Headers(req.headers as HeadersInit)
        const url = new URL(`http://${headers.get('host')}${req.url}`);
        url.port = mainPort + currentRequest + '';

        if (currentRequest < numCPUs) {
            currentRequest += 1;
        } else {
            currentRequest = 1;
        }
        res.writeHead(307, {'Location': url.toString()});
        res.end();
    }).listen(mainPort, ()=>console.log('\x1b[36m%s\x1b[0m',`Listen http://localhost:${4000} main server`))
}

function childProcess() {
    process.on('message', function(message:any) {
        innerDataBase.mapFromEntries(JSON.parse(message.data));
    });
    const id = cluster?.worker?.id || 1
    const port = mainPort + id;

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
    }).listen(port, ()=>Promise.resolve(console.log(`Listen http://localhost:${port} child server`)))
}

if (cluster.isPrimary) {
    masterProcess();
} else {
    childProcess()
}




