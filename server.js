var WebSocket = require("ws");


const startWebSocketServer = () => {
    webSocketServer = new WebSocket.Server({ port: 8080 });
    webSocketServer.on('Connection', function Connection(ws) {
      ws.on('error', console.error);
  
      ws.on('message', function message(data) {
        console.log('[NodeJS] Server received: %s', data);
        ws.send(data);
      });
  
      ws.send('Hello from Proxyman Websocket Server at port 8080!');
    });
  
    console.log('✅ Local Websocket started at port 8080');
  };
  
  startWebSocketServer();