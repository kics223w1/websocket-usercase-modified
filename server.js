const WebSocket = require('ws');
const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 4000;

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Echo Server is running\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  // Extract query parameters from the request URL
  const parsedUrl = url.parse(req.url, true);
  const query = parsedUrl.query;
  const pathname = parsedUrl.pathname;

  // Extract headers
  const headers = req.headers;

  console.log('\n✅ Client connected!');
  console.log('📍 Path:', pathname);
  console.log('📋 Query Parameters:', query);
  console.log('🔐 Headers:', headers);

  // Send initial greeting with connection info
  const greeting = {
    type: 'greeting',
    message: 'Welcome to WebSocket Echo Server',
    timestamp: new Date().toISOString(),
    receivedUrl: req.url,
    receivedQuery: query,
    receivedHeaders: req.headers,
  };

  ws.send(JSON.stringify(greeting));

  // Handle incoming messages
  ws.on('message', (data) => {
    console.log('\n📥 Received message from client');

    // Try to parse as JSON, otherwise treat as raw string
    let messageBody;
    try {
      messageBody = JSON.parse(data);
    } catch (e) {
      messageBody = data.toString();
    }

    console.log('📦 Message body:', messageBody);

    // Create echo response
    const echoResponse = {
      type: 'echo',
      timestamp: new Date().toISOString(),
      received: {
        body: messageBody,
        query: query,
        path: pathname,
        headers: {
          host: headers.host,
          origin: headers.origin,
          connection: headers.connection,
          upgrade: headers.upgrade,
          'user-agent': headers['user-agent'],
          'sec-websocket-extensions': headers['sec-websocket-extensions'],
        },
      },
    };

    // Send echo back to client
    ws.send(JSON.stringify(echoResponse));
    console.log('✉️ Echo response sent');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
  });

  // Handle client disconnect
  ws.on('close', (code, reason) => {
    console.log(
      '\n👋 Client disconnected',
      `(Code: ${code}, Reason: ${reason || 'None'})`
    );
  });

  // Handle ping/pong
  ws.on('ping', () => {
    console.log('🏓 Received ping, sending pong...');
  });

  ws.on('pong', () => {
    console.log('🏓 Received pong');
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 WebSocket Echo Server is running at ws://localhost:${PORT}`);
  console.log(`📝 Server will echo back request body, query, and headers\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close(1000, 'Server shutting down');
    }
  });
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

