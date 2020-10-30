/* const net = require('net');

const client = new net.Socket();
const stdin = process.openStdin();

/* client.on('connect', (data) => {
  console.log(data.toString('utf-8'));
});
 */
client.on('data', (data) => {
  console.log(data.toString('utf-8'));
});

client.on('close', () => {
  console.log('você saiu da sala');
});

client.connect(3000, 'localhost', () => {
  client.on('connect', (data) => {
    console.log(data.toString('utf-8'));
  });
  stdin.addListener('data', (data) => {
    const message = data.toString('utf-8').trim();
    client.write(message);
  });
});
 */