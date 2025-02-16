### WebSocket Testing Guide

This guide explains how to test both secure (WSS) and non-secure (WS) WebSocket connections.

#### Prerequisites

- Node.js installed
- npm packages installed (`npm install`)

#### Testing WebSocket (WS)

1. Start the WebSocket server:
   ```bash
   npm run start_ws
   ```
2. In the terminal:
   - Type `send` to send test requests
   - Type `exit` to close the connection

#### Testing Secure WebSocket (WSS)

1. Start the secure WebSocket server:
   ```bash
   npm run start_wss
   ```
2. In the terminal:
   - Type `send` to send test requests
   - Type `exit` to close the connection
