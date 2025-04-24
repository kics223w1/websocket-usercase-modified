var WebSocket = require("ws");
var HttpsProxyAgent = require("https-proxy-agent");
var url = require("url");
const { exit } = require("process");
const msgpack = require("@msgpack/msgpack");
const zlib = require("zlib");
const { compress, decompress } = require("@mongodb-js/zstd");

// Approve Proxyman Certificate
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const myArgs = process.argv.slice(2);
const protocol = myArgs[0] ?? "wss";
const isEnabledWebsocketServer = myArgs[1];

var URL = "";
switch (protocol) {
  case "wss":
    URL = "wss://ws.postman-echo.com/raw";
    break;
  case "ws":
    URL = "ws://echo.websocket.events";
    break;
  default:
    URL = "ws://echo.websocket.events";
    break;
}

////////////////////////
// WebSocket Server Side (Optional)
////////////////////////
var websocketServer;
if (isEnabledWebsocketServer === "server") {
  websocketServer = new WebSocket.WebSocketServer({ port: 8080 });
  websocketServer.on("connection", function connection(ws) {
    ws.on("error", console.error);

    ws.on("message", function message(data) {
      try {
        const decoded = msgpack.decode(data);
        console.log("[NodeJS] Server received (decoded):", decoded);
        ws.send(data); // Echo back
      } catch (e) {
        console.log("[NodeJS] Server received (raw):", data);
        ws.send(data); // Echo raw
      }
    });

    const greeting = msgpack.encode({
      type: "greeting",
      data: "Hello from Proxyman WebSocket Server at port 8080!",
    });
    ws.send(greeting);
  });
  console.log("✅ Local WebSocket server started at port 8080");
}

let id = 1;

////////////////////////
// WebSocket Client Side
////////////////////////
var proxy = "http://0.0.0.0:9090";
var options = url.parse(proxy);
var agent = new HttpsProxyAgent(options);
const ws = new WebSocket(URL, { agent: agent });

const handleWebsocketOpen = async () => {
  console.log("[NodeJS] WebSocket Client is opened!");

  // Send MsgPack JSON message
  const obj = { data: "MsgPack" };
  const packedJson = msgpack.encode({ type: "json", data: obj, id });
  console.log(`[NodeJS] ⬆️ Send MsgPack JSON ${id}`);
  ws.send(packedJson);
  id += 1;

  // Send Zstd compressed raw string message using @mongodb-js/zstd
  const zstdString = `This is a pure zstd compressed message ${id}`;
  const stringBuffer = Buffer.from(zstdString, "utf8");
  try {
    const compressedZstd = await compress(stringBuffer); // Use async compress
    console.log(`[NodeJS] ⬆️ Send pure Zstd ${id}`);
    ws.send(compressedZstd);
    id += 1;
  } catch (err) {
    console.error("[NodeJS] ❌ Zstd compression error:", err);
  }

  // Send Deflated raw string message
  const deflateString = `This is a deflated message ${id}`;
  const deflateBuffer = Buffer.from(deflateString, "utf8");
  try {
    const compressedDeflate = zlib.deflateSync(deflateBuffer);
    console.log(`[NodeJS] ⬆️ Send Deflated ${id}`);
    ws.send(compressedDeflate);
    id += 1;
  } catch (err) {
    console.error("[NodeJS] ❌ Deflate compression error:", err);
  }

  // Send Gzip compressed raw string message
  const gzipString = `This is a gzipped message ${id}`;
  const gzipBuffer = Buffer.from(gzipString, "utf8");
  try {
    const compressedGzip = zlib.gzipSync(gzipBuffer);
    console.log(`[NodeJS] ⬆️ Send Gzip ${id}`);
    ws.send(compressedGzip);
    id += 1;
  } catch (err) {
    console.error("[NodeJS] ❌ Gzip compression error:", err);
  }

  // Keep the ping
  console.log("[NodeJS] ⬆️ Ping");
  ws.ping();
};

const handleWebsocketMessage = async (data) => {};

const handleWebsocketPong = () => {
  // console.log("[NodeJS] ⬇️ Pong!");
  // const obj = { name: "Noah", items: [1, 2, 3, 4], id };
  // const msgpackObj = msgpack.encode({ type: "pong", data: obj, id });
  // console.log(`[NodeJS] ⬆️ Send MsgPack JSON ${id}`);
  // ws.send(msgpackObj);
  // id += 1;
};

const handleWebsocketClose = () => {
  console.log("[NodeJS] Closed!");
  exit(0);
};

ws.on("message", function message(data) {
  handleWebsocketMessage(data);
});

ws.on("error", function message(err) {
  console.log("[NodeJS] ❌ Error: %s", err);
});

ws.on("pong", () => {
  handleWebsocketPong();
});

ws.on("close", function clear() {
  handleWebsocketClose();
});

ws.on("open", () => {
  handleWebsocketOpen();
});
