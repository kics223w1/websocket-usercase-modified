const url = require('url');
var WebSocket = require("ws");
const HttpsProxyAgent = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const handleSendWebsocketRequest = (
    socketURL = "ws://localhost:8080/raw",
    proxyPort = 9090,
    done = () => {}
  ) => {
    // HTTP/HTTPS proxy to connect to
    const proxy = `http://0.0.0.0:${proxyPort}`;
  
    const options = url.parse(proxy);
    const agent = new HttpsProxyAgent(options);
    const ws = new WebSocket(socketURL, { agent: agent });
  
    var shouldExit = false;
    console.log(`WS connection is opened! URL = ${socketURL}`);
  
    ws.on('open', function open() {
      // Text
      console.log('[NodeJS] Websocket Client is opened!');
      ws.send('Hello from Proxyman Websocket Client');
  
      // JSON
      const obj = { name: 'John', age: 30, city: 'New York' };
      const myJSON = JSON.stringify(obj);
      console.log('[NodeJS] ⬆️ Send JSON 1');
      ws.send(myJSON);
  
      // Ping
      console.log('[NodeJS] ⬆️ Ping');
      ws.ping();
    });
  
    ws.on('message', function message(data) {
      console.log('[NodeJS] ⬇️ Received: %s', data);
  
      if (shouldExit) {
        ws.close();
      }
    });
  
    ws.on('error', function message(err) {
      console.log('[NodeJS] ❌ Err: %s', err);
    });
  
    ws.on('pong', () => {
      console.log('[NodeJS] ⬇️ Pong!');
  
      // try to send a JSON again
      const obj = { name: 'Noah', items: [1, 2, 3, 4] };
      const myJSON = JSON.stringify(obj);
      console.log('[NodeJS] ⬆️ Send JSON 2');
      ws.send(myJSON);
  
      // exit
      shouldExit = true;
    });
  
    ws.on('close', function clear() {
      console.log('[NodeJS] Closed!');
      done();
    });
  };

const handleSecureWebsocketRequest = (
    socketURL = "wss://localhost:8443/ws",
    proxyPort = 9090,
    done = () => {}
  ) => {
    // HTTP/HTTPS proxy to connect to
    const proxy = `http://0.0.0.0:${proxyPort}`;
  
    const options = url.parse(proxy);
    const agent = new HttpsProxyAgent(options);
    const ws = new WebSocket(socketURL, { agent: agent });
  
    var shouldExit = false;
    console.log(`Secure WS connection is opened! URL = ${socketURL}`);
  
    ws.on('open', function open() {
      // Text
      console.log('[NodeJS] Secure Websocket Client is opened!');
      ws.send('Hello from Proxyman Secure Websocket Client');
  
      // JSON
      const obj = { name: 'Alice', age: 25, city: 'San Francisco' };
      const myJSON = JSON.stringify(obj);
      console.log('[NodeJS] ⬆️ Send JSON 1 (Secure)');
      ws.send(myJSON);
  
      // Ping
      console.log('[NodeJS] ⬆️ Ping (Secure)');
      ws.ping();
    });
  
    ws.on('message', function message(data) {
      console.log('[NodeJS] ⬇️ Received (Secure): %s', data);
  
      if (shouldExit) {
        ws.close();
      }
    });
  
    ws.on('error', function message(err) {
      console.log('[NodeJS] ❌ Secure Err: %s', err);
    });
  
    ws.on('pong', () => {
      console.log('[NodeJS] ⬇️ Pong (Secure)!');
  
      // try to send a JSON again
      const obj = { name: 'Emma', items: [5, 6, 7, 8] };
      const myJSON = JSON.stringify(obj);
      console.log('[NodeJS] ⬆️ Send JSON 2 (Secure)');
      ws.send(myJSON);
  
      // exit
      shouldExit = true;
    });
  
    ws.on('close', function clear() {
      console.log('[NodeJS] Secure Connection Closed!');
      done();
    });
  };

// SOCKSv5 over WS
const handleSocksWebsocketRequest = (
  socketURL = "ws://echo.websocket.events",
  socksHost = "127.0.0.1",
  socksPort = 8889,
  done = () => {}
) => {
  const socksProxyUrl = `socks5h://${socksHost}:${socksPort}`;
  const agent = new SocksProxyAgent(socksProxyUrl);
  const ws = new WebSocket(socketURL, { agent });

  let shouldExit = false;
  console.log(`WS over SOCKS connection is opened! URL = ${socketURL} via ${socksProxyUrl}`);

  ws.on('open', function open() {
    console.log('[NodeJS] Websocket Client (SOCKS) is opened!');
    ws.send('Hello from SOCKS5 Websocket Client');

    const obj = { name: 'John', age: 30, city: 'New York' };
    const myJSON = JSON.stringify(obj);
    console.log('[NodeJS] ⬆️ Send JSON 1 (SOCKS)');
    ws.send(myJSON);

    console.log('[NodeJS] ⬆️ Ping (SOCKS)');
    ws.ping();
  });

  ws.on('message', function message(data) {
    console.log('[NodeJS] ⬇️ Received (SOCKS): %s', data);
    if (shouldExit) {
      ws.close();
    }
  });

  ws.on('error', function message(err) {
    console.log('[NodeJS] ❌ SOCKS Err: %s', err);
  });

  ws.on('pong', () => {
    console.log('[NodeJS] ⬇️ Pong (SOCKS)!');
    const obj = { name: 'Noah', items: [1, 2, 3, 4] };
    const myJSON = JSON.stringify(obj);
    console.log('[NodeJS] ⬆️ Send JSON 2 (SOCKS)');
    ws.send(myJSON);
    shouldExit = true;
  });

  ws.on('close', function clear() {
    console.log('[NodeJS] SOCKS Connection Closed!');
    done();
  });
};

// SOCKSv5 over WSS
const handleSecureSocksWebsocketRequest = (
  socketURL = "wss://ws.postman-echo.com/raw",
  socksHost = "127.0.0.1",
  socksPort = 8889,
  done = () => {}
) => {
  const socksProxyUrl = `socks5h://${socksHost}:${socksPort}`;
  const agent = new SocksProxyAgent(socksProxyUrl);
  const ws = new WebSocket(socketURL, { agent });

  let shouldExit = false;
  console.log(`Secure WS over SOCKS connection is opened! URL = ${socketURL} via ${socksProxyUrl}`);

  ws.on('open', function open() {
    console.log('[NodeJS] Secure Websocket Client (SOCKS) is opened!');
    ws.send('Hello from SOCKS5 Secure Websocket Client');

    const obj = { name: 'Alice', age: 25, city: 'San Francisco' };
    const myJSON = JSON.stringify(obj);
    console.log('[NodeJS] ⬆️ Send JSON 1 (SOCKS Secure)');
    ws.send(myJSON);

    console.log('[NodeJS] ⬆️ Ping (SOCKS Secure)');
    ws.ping();
  });

  ws.on('message', function message(data) {
    console.log('[NodeJS] ⬇️ Received (SOCKS Secure): %s', data);
    if (shouldExit) {
      ws.close();
    }
  });

  ws.on('error', function message(err) {
    console.log('[NodeJS] ❌ SOCKS Secure Err: %s', err);
  });

  ws.on('pong', () => {
    console.log('[NodeJS] ⬇️ Pong (SOCKS Secure)!');
    const obj = { name: 'Emma', items: [5, 6, 7, 8] };
    const myJSON = JSON.stringify(obj);
    console.log('[NodeJS] ⬆️ Send JSON 2 (SOCKS Secure)');
    ws.send(myJSON);
    shouldExit = true;
  });

  ws.on('close', function clear() {
    console.log('[NodeJS] SOCKS Secure Connection Closed!');
    done();
  });
};

// Entrypoint selection by argv
const mode = process.argv[2] || '';
switch (mode) {
  case 'socks-ws':
    handleSocksWebsocketRequest();
    break;
  case 'socks-wss':
    handleSecureSocksWebsocketRequest();
    break;
  case 'ws':
    handleSendWebsocketRequest();
    break;
  case 'wss':
  default:
    handleSecureWebsocketRequest();
    break;
}
  