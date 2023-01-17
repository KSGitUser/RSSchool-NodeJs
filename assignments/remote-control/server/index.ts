import { WebSocketServer } from "ws";
import { nutFunctions, parseCommands } from "./src/nut-commands.js";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
    const [command, ...args] = parseCommands(data.toString());

    if (!command) return;
    (async () => {
      await nutFunctions[command](...args);
    })();
  });

  ws.send("mouse_up 10");
});
