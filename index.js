const { Server } = require('socket-be');
const server = new Server({
  port: 8000,
  timezone: 'Asia/Tokyo',
});

server.events.on('serverOpen', () => {
  console.log('open!');
});

server.events.on('playerChat', async (event) => {
  if (event.sender === '外部') return; // スパムの無限ループを防ぐ
  
  server.logger.info(`<${event.sender}> ${event.message}`);
  
  if (event.message === 'ping') {
    await event.world.sendMessage('Pong!');
  }
});