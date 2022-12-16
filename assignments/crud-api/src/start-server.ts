import http from "node:http"
const PORT =  3000

const server = http.createServer((_, res) => {
    res.end('Hello from server')
})

export const startServer = () => {
    server.listen(PORT);
}
