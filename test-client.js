const WebSocket = require('ws');

// Configuration
const WS_URL = 'ws://localhost:8080/api/echo?userId=123&action=test';
const PORT = 8080;

console.log('🔌 WebSocket Echo Server Test Client\n');
console.log(`Connecting to: ${WS_URL}\n`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ Connected to server!\n');

  // Test 1: Send a JSON object
  console.log('📤 Test 1: Sending JSON object...');
  const jsonMessage = {
    type: 'user_info',
    name: 'John Doe',
    email: 'john@example.com',
    action: 'login',
  };
  ws.send(JSON.stringify(jsonMessage));

  // Test 2: Send after 1 second
  setTimeout(() => {
    console.log('\n📤 Test 2: Sending plain text...');
    ws.send('Hello from test client!');
  }, 1000);

  // Test 3: Send after 2 seconds
  setTimeout(() => {
    console.log('\n📤 Test 3: Sending another JSON...');
    const anotherMessage = {
      type: 'data_request',
      query: 'userId=123',
      timestamp: new Date().toISOString(),
    };
    ws.send(JSON.stringify(anotherMessage));
  }, 2000);

  // Test 4: Send ping after 3 seconds
  setTimeout(() => {
    console.log('\n📤 Test 4: Sending ping...');
    ws.ping();
  }, 3000);

  // Close connection after 4 seconds
  setTimeout(() => {
    console.log('\n👋 Closing connection...\n');
    ws.close(1000, 'Test completed');
  }, 4000);
});

ws.on('message', (data) => {
  console.log('\n📥 Received from server:');
  try {
    const parsed = JSON.parse(data);
    console.log(JSON.stringify(parsed, null, 2));
  } catch (e) {
    console.log(data.toString());
  }
});

ws.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
});

ws.on('close', (code, reason) => {
  console.log(`\n✅ Connection closed (Code: ${code}, Reason: ${reason || 'None'})`);
  process.exit(0);
});

ws.on('pong', () => {
  console.log('📥 Received pong from server');
});

