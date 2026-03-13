const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080/ws');
ws.on('open', () => console.log('Connected'));
ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.hub === 'kuala-lumpur') {
    console.log('KL Data:', JSON.stringify(msg));
    process.exit(0);
  }
});
setTimeout(() => { console.log('Timeout'); process.exit(1); }, 5000);
