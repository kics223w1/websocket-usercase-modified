# WebSocket Echo Server

A simple Node.js WebSocket server that echoes back the request body, query parameters, and headers to the client.

## Features

✅ **Echo Response** - Receives messages from clients and echoes them back  
✅ **Query Parameters** - Captures and returns URL query parameters  
✅ **Headers** - Captures and returns HTTP headers from the WebSocket upgrade request  
✅ **JSON & Text** - Handles both JSON objects and plain text messages  
✅ **Ping/Pong Support** - Responds to ping/pong heartbeat messages  
✅ **Graceful Shutdown** - Properly closes client connections on server shutdown  
✅ **Detailed Logging** - Clear console output for all events  

## Installation

Ensure you have Node.js installed, then install dependencies:

```bash
npm install
```

## Usage

### Start the Server

```bash
npm run server
```

Or directly:

```bash
node server.js
```

The server will start on `http://localhost:8080` (or the port specified in the `PORT` environment variable).

### Test the Server

In a separate terminal, run the test client:

```bash
npm run test
```

Or directly:

```bash
node test-client.js
```

### Custom Port

To run the server on a different port:

```bash
PORT=3000 npm run server
```

## WebSocket Connection

### Basic Connection

```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');
```

### With Query Parameters

```javascript
const ws = new WebSocket('ws://localhost:8080/api/echo?userId=123&action=test');
```

### Send Messages

```javascript
// Send JSON
ws.send(JSON.stringify({ type: 'message', data: 'Hello!' }));

// Send plain text
ws.send('Hello Server!');

// Send ping
ws.ping();
```

## Server Response Format

### Greeting Message (on connection)

```json
{
  "type": "greeting",
  "message": "Welcome to WebSocket Echo Server",
  "timestamp": "2025-11-27T10:30:00.000Z",
  "receivedUrl": "/api/echo?userId=123&action=test",
  "receivedQuery": {
    "userId": "123",
    "action": "test"
  },
  "receivedHeaders": {
    "host": "localhost:8080",
    "origin": "http://localhost",
    "connection": "Upgrade",
    "upgrade": "websocket",
    "user-agent": "Node.js WebSocket Client",
    "sec-websocket-key": "...",
    "sec-websocket-version": "13"
  }
}
```

### Echo Response (for each message)

```json
{
  "type": "echo",
  "timestamp": "2025-11-27T10:30:01.000Z",
  "received": {
    "body": {
      "type": "user_info",
      "name": "John Doe"
    },
    "query": {
      "userId": "123",
      "action": "test"
    },
    "path": "/api/echo",
    "headers": {
      "host": "localhost:8080",
      "origin": "http://localhost"
    }
  }
}
```

## Example Usage

### Node.js Example

```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080/users?userId=42');

ws.on('open', () => {
  console.log('Connected!');
  
  // Send a message
  ws.send(JSON.stringify({
    action: 'update',
    data: { name: 'Alice', email: 'alice@example.com' }
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data);
  console.log('Echo received:', response);
  // The server echoes back your message with query and headers info
});

ws.on('close', () => {
  console.log('Disconnected!');
});
```

### Browser Example (using web-socket library or fetch API upgrade)

```javascript
const ws = new WebSocket('ws://localhost:8080/chat?roomId=general&userId=101');

ws.onopen = () => {
  console.log('Connected to echo server');
  ws.send(JSON.stringify({ message: 'Hello' }));
};

ws.onmessage = (event) => {
  const response = JSON.parse(event.data);
  console.log('Server echo:', response);
};

ws.onclose = () => {
  console.log('Connection closed');
};
```

## Command Line Scripts

| Command | Description |
|---------|-------------|
| `npm run server` | Start the WebSocket echo server |
| `npm run test` | Run the test client |
| `npm run start_ws` | Start main.js in WS mode |
| `npm run start_wss` | Start main.js in WSS mode |

## Project Structure

```
.
├── server.js                 # WebSocket echo server (NEW)
├── test-client.js           # Test client for the server (NEW)
├── main.js                  # Original WebSocket client
├── client.js                # Additional WebSocket client utilities
├── package.json             # NPM configuration
└── ECHO_SERVER_README.md   # This file
```

## How It Works

1. **Server Starts**: Listens on port 8080 for WebSocket connections
2. **Client Connects**: Sends WebSocket upgrade request with query params and headers
3. **Server Greets**: Sends greeting message with received connection info
4. **Client Sends**: Sends message (JSON or text)
5. **Server Echoes**: Responds with echo containing:
   - Original message body
   - Query parameters from URL
   - Request path
   - HTTP headers
6. **Connection Closes**: Either client or server can close gracefully

## Troubleshooting

### "Port already in use"
Change the port:
```bash
PORT=3000 npm run server
```

### "Cannot connect to server"
- Ensure the server is running
- Check the correct URL: `ws://localhost:8080`
- Verify no firewall is blocking port 8080

### "Dependency not found"
Reinstall dependencies:
```bash
npm install
```

## Notes

- Messages are automatically parsed as JSON if possible, otherwise treated as strings
- The server handles both text frames and binary frames
- Graceful shutdown listens for SIGINT (Ctrl+C)
- All timestamps are in ISO 8601 format
- Headers include the WebSocket upgrade headers from the HTTP request

## License

ISC

