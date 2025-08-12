# WebSocket Test Project

A Node.js WebSocket client/server project for testing different protocols and compression methods (MsgPack, Zstd, Deflate, Gzip).

## Quick Start

Install dependencies:
```bash
npm install
```

## Available Scripts

### Main WebSocket Client (`main.js`)
- **`npm run start_ws`** - Start WebSocket client using `ws://` protocol
- **`npm run start_wss`** - Start WebSocket client using `wss://` protocol  

### Simple Client Test (`client.js`)
- **`npm run ws-client-cert`** - Run secure WebSocket client with proxy support
- **`npm run ws-client-socks`** - Run WebSocket client via SOCKSv5 at `localhost:8889` (connects to public echo server)
- **`npm run wss-client-socks`** - Run Secure WebSocket client via SOCKSv5 at `localhost:8889` (connects to public echo server)


## Usage Examples

```bash
# Basic WebSocket client
npm run start_ws

# Secure WebSocket client
npm run start_wss

# Simple client test
npm run ws-client-cert

# WebSocket via SOCKSv5 at localhost:8889 (to internet echo services)
npm run ws-client-socks
npm run wss-client-socks
```

The client will connect through an HTTP proxy at `http://0.0.0.0:9090` for the default modes, or through a SOCKSv5 proxy at `socks5h://127.0.0.1:8889` for the SOCKS modes, and send various messages to test WebSocket functionality.
