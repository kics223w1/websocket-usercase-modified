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
- **`npm run start_wss_include_server`** - Start both WebSocket client (`wss://`) and local server

### Simple Client Test (`client.js`)
- **`npm run ws-client-cert`** - Run secure WebSocket client with proxy support

## Features

- **Compression**: MsgPack, Zstd, Deflate, Gzip
- **Protocols**: Both `ws://` and `wss://` support
- **Proxy**: HTTP proxy support (port 9090)
- **Server**: Optional local WebSocket server (port 8080)

## Usage Examples

```bash
# Basic WebSocket client
npm run start_ws

# Secure WebSocket client
npm run start_wss

# Client + Server mode
npm run start_wss_include_server

# Simple client test
npm run ws-client-cert
```

The client will connect through a proxy at `http://0.0.0.0:9090` and send various compressed message formats to test WebSocket functionality.