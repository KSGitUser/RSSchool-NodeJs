import { WebSocketServer, createWebSocketStream } from "ws";
import { nutFunctions, parseCommands } from "./src/nut-commands.js";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  const stream = createWebSocketStream(ws, {
    decodeStrings: false,
  });
  ws.on("message", function message(data) {
    const [command, ...args] = parseCommands(data.toString());
    if (!command) return;
    (async () => {
      const result = await nutFunctions[command](...args);
      if (result) {
        stream.write(result);
      }
    })();
  });
});
